require('dotenv').config()
const debug = require('debug')('lovejob:web')
const fastify = require('fastify')({ logger: process.env.WEB_LOG === '1' })
const { query, disconnect } = require('./db')

fastify.get('/noti/list', async (request, reply) => {
  const address = request.query.address
  debug(`Get notifications for ${address}`)
  if (!address) {
    return {
      ok: false,
      error: 'Address is required.'
    }
  }

  const sql = 'SELECT * FROM notification WHERE sender <> receiver AND receiver = ? ORDER BY id DESC LIMIT 10'
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

// Run the server!
const start = async () => {
  try {
    await fastify.listen(9000)
    debug(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    disconnect(err => {
      debug(err)
      process.exit(1)
    })
  }
}
start()
