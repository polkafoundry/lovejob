require('dotenv').config()

const debug = require('debug')('lovejob:job')
const _ = require('lodash')
const { ensureContract, convertValue } = require('./util')
const { table, mapping } = require('./map.json')

const { IceteaWeb3 } = require('@iceteachain/web3')
const web3 = new IceteaWeb3(process.env.ICETEA_RPC)

const { query, disconnect } = require('./db')

const close = () => {
  const unsub = (global._sub && global._sub.unsubscribe) ? global._sub.unsubscribe() : Promise.resolve(undefined)
  unsub.finally(() => {
    Promise.resolve(web3.close()).finally(disconnect(debug))
  })
}

const handleError = error => {
  debug(error)
  close()

  // for some reason, it does not exit
  setTimeout(() => {
    process.exit(1)
  }, 5000)
}

const watchEvents = async () => {
  const contract = await ensureContract(web3, process.env.LOVELOCK_CONTRACT)
  global._sub = contract.events.allEvents({}, async (error, result) => {
    if (error) {
      handleError(error)
      return
    }

    debug(result)
    result.forEach(item => {
      // covert to array of items
      const eventName = item.eventName
      const map = mapping[eventName]
      if (map) {
        const columns = ['`event_name`', ...Object.keys(map).map(x => '`' + x + '`')]
        const params = '?' + ',?'.repeat(columns.length - 1)
        const values = Object.values(map).reduce((list, value) => {
          const [prop, ...converters] = value.split('/')
          const v = convertValue(_.get(item, prop), converters)
          list.push(v)
          return list
        }, [eventName])
        const sql = `INSERT IGNORE INTO \`${table}\` (${columns.join(',')}) VALUES (${params})`
        debug(sql, values)
        query(sql, values).catch(debug)
      }
    })
  })
}

const start = () => {
  // exit in case the websocket is lost (e.g. rpc restarts), so pm2 can restart things
  web3.onError(handleError)

  watchEvents()

  debug('Job is watching for events...')
}

start()
