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
fastify.get('/noti/list', async (request, reply) => {
  const address = request.query.address
  debug(`Get notifications for ${address}`)
  if (!address) {
    return {
      ok: false,
      error: 'Address is required.'
    }
  }

  const sql =
    'SELECT * FROM notification WHERE sender <> receiver AND receiver = ? ORDER BY id DESC LIMIT 10'
  try {
    const result = await query(sql, [address])
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

// noti like, comment
fastify.get('/noti/list/lc', async (request, reply) => {
  const address = request.query.address
  debug(`Get notifications for ${address}`)
  if (!address) {
    return {
      ok: false,
      error: 'Address is required.'
    }
  }

  const sql =
    "SELECT * FROM notification WHERE event_name IN ('addLike', 'addComment') AND (receiver = ? OR sender = ?) ORDER BY id DESC LIMIT 10"
  try {
    const result = await query(sql, [address, address])
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
fastify.get('/noti/mark', async (request, reply) => {
  const id = request.query.id
  debug(`Mark ${id} as read`)
  if (!id) {
    return {
      ok: false,
      error: 'Id is required.'
    }
  }

  const sql = 'DELETE FROM notification WHERE id = ?'
  try {
    const result = await query(sql, [id])
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

// mark lock as read
fastify.get('/noti/lock/mark', async (request, reply) => {
  const id = request.query.id
  debug(`Mark ${id} as read`)
  if (!id) {
    return {
      ok: false,
      error: 'Id is required.'
    }
  }

  const sql = "DELETE FROM notification WHERE event_name IN ('createLock') AND lockIndex = ?"
  try {
    const result = await query(sql, [id])
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
