require('dotenv').config()
const debug = require('debug')('lovejob:web')
const fastify = require('fastify')({ logger: process.env.WEB_LOG === '1' })
const cors = require('fastify-cors')
const { query, disconnect } = require('./db')
const { handleOptions } = require('./util')

fastify.register(cors, handleOptions())
fastify.get('/', async (request, reply) => {
  reply.send('Wellcome LoveJob API!')
})
fastify.get('/noti/list', async (request) => {
  const address = request.query.address
  debug(`Get notifications for ${address}`)
  if (!address) {
    return {
      ok: false,
      error: 'Address is required.'
    }
  }

  const sqlLock =
    "SELECT * FROM notification WHERE event_name = 'createLock' AND target = ? ORDER BY id DESC LIMIT 10"

  const sqlNonLock =
    "SELECT * FROM notification WHERE event_name <> 'createLock' AND target = ? ORDER BY id DESC LIMIT 10"

  try {
    const result = await Promise.all([query(sqlLock, [address]), query(sqlNonLock, [address])]) 
    return {
      ok: true,
      result
    }
  } catch (error) {
    debug(error)
    return {
      ok: false,
      error: String(error)
    }
  }
})

// mark an notification as read
fastify.get('/noti/mark', async (request) => {
  const { id, lock_id: lockId } = request.query
  const [field, value] = id == null ? ['item_id', lockId] : ['id', id]
  debug(`Mark ${field} = ${value} as read`)
  if (value == null) {
    return {
      ok: false,
      error: 'Either id or lock_id is required.'
    }
  }

  const where = field === 'item_id' ? "event_name = 'createLock' AND " : ''
  const sql = `DELETE FROM notification WHERE ${where}${field} = ?`
  try {
    const result = await query(sql, [value])
    return {
      ok: true,
      result
    }
  } catch (error) {
    debug(error)
    return {
      ok: false,
      error: String(error)
    }
  }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 9000)
    debug(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    disconnect((err) => {
      debug(err)
      process.exit(1)
    })
  }
}
start()
