// TODO: should be in es5
import { exec } from "child_process"
import app from "/"

let server
global.PORT = 3333

global.beforeAll(async () => {
  await migrate()
  server = await startServer(app, global.PORT)
})

/**
 * Cleaning database before every test
 */
global.beforeEach(async () => {
  const tables = await app.pg.manyOrNone(
    `SELECT * FROM information_schema.tables WHERE table_schema = 'public'`
  )
  await Promise.all(
    tables
      .filter(item => item.tableName !== "migrations")
      .map(item => app.pg.none(`DELETE FROM ${item.tableName}`))
  )
})

global.afterAll(async () => {
  await app.pg.$pool.end()
  await closeServer(server)
  await migrate()
})

function startServer(app, port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      resolve(server)
    })
  })
}

function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close(resolve)
  })
}

function migrate() {
  return new Promise((resolve, reject) => {
    /**
     * Cleaning database in case it was not properly destroyed
     */
    exec("yarn migrate:down", (err, stdout, stderr) => {
      if (err || stderr) return reject(err || stderr)

      /**
       * Applying database migrations
       */
      exec("yarn migrate:up", (err, stdout, stderr) => {
        if (err || stderr) return reject(err || stderr)
        resolve()
      })
    })
  })
}
