const mysql = require('mysql2')

const pool = mysql.createPool({
  connectionLimit: 100,
  waitForConnections: true,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  insecureAuth: true // use password for MySql 8.x
})

const query = (...args) => {
  return new Promise((resolve, reject) => {
    pool.query(...args, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

const disconnect = (...args) => pool.end(...args)

module.exports = { query, disconnect }
