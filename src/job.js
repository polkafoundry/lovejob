require('dotenv').config()
const debug = require('debug')('lovejob:job')

const {
  getValue,
  getTargets,
  handleTargets,
  getActor,
  handleTags,
  push,
  handleError,
  handleClose
} = require('./util')

const {
  initWeb3,
  listenAllEvents,
  ping
} = require('./web3')

const { table, mapping } = require('./map.json')

const handleEvent = async result => {
  debug(result)
  result.forEach(async item => {
    const eventName = item.eventName

    const eventConfigs = mapping.filter(m => m.eventName === eventName)
    if (!eventConfigs.length) return

    eventConfigs.forEach(async ({ map, options = {} }) => {
      const {
        conditions,
        actorPath = 'eventData.by',
        targetPaths = ['eventData.log.sender', 'eventData.log.receiver'],
        tagPath
      } = options

      // Check conditions whether to skip this item
      if (conditions) {
        // conditions are AND
        const ok = Object.entries(conditions).every(([path, mustBe]) => {
          const not = path.startsWith('!')
          if (not) path = path.slice(1)
          const value = getValue(item, path)
          return not ? value !== mustBe : value === mustBe
        })
        if (!ok) {
          debug('Item skipped')
          return
        }
      }

      // get actor address, displayName, avatar
      const { actorAddr, actorName, actorAvatar } = await getActor(item, actorPath)

      const columns = [
        '`event_name`',
        '`actor_addr`',
        '`actor_name`',
        '`actor_avatar`',
        ...Object.keys(map).map((x) => '`' + x + '`'),
        '`target`'
      ]
      const params = '?' + ',?'.repeat(columns.length - 1)
      const values = Object.values(map).reduce(
        (list, path) => push(list, getValue(item, path)),
        [eventName, actorAddr, actorName, actorAvatar]
      )

      const sql = `INSERT IGNORE INTO \`${table}\` (${columns}) VALUES (${params})`
      const targets = getTargets(item, targetPaths, actorAddr)
      handleTargets(sql, values, targets)

      // now, handle tagging usernames
      handleTags(item, tagPath, sql, values, targetPaths)
    })
  })
}

const start = () => {
  initWeb3(handleError, handleClose)
  listenAllEvents(handleEvent, handleError)

  setInterval(() => {
    ping().catch(handleError)
  }, +process.env.PING_INTERNAL || 45000)

  debug('Job is watching for events...')
}

start()
