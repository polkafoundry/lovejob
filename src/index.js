require('dotenv').config()
const debug = require('debug')('lovejob:web')
const fastify = require('fastify')({ logger: process.env.WEB_LOG === '1' })
const { query, disconnect } = require('./db')

fastify.get('/noti/list', async (request, reply) => {
  const address = request.query.address
  debug(address)
  if (!address) {
    return {
      ok: false,
      error: 'Address is required.'
    }
  }

  const sql = 'SELECT * FROM notification WHERE sender = ? OR receiver = ?'
  try {
    const result = await query(sql, [address, address])
    return {
      ok: true,
      result
    }
  } catch (error) {
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
