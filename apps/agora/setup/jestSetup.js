// TODO: should be in es5
import util from "util"
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
  return new Promise(resolve => {
    const server = app.listen(port, () => {
      resolve(server)
    })
  })
}

function closeServer(server) {
  return new Promise(resolve => {
    server.close(resolve)
  })
}

async function migrate() {
  /**
   * Cleaning database in case it was not properly destroyed
   */
  await asyncExec("yarn migrate:down")
  /**
   * Applying database migrations
   */
  await asyncExec("yarn migrate:up")
}

async function asyncExec(cmd) {
  try {
    const { stdout, stderr } = await util.promisify(exec)(cmd)

    if (stderr) throw stderr

    return stdout
  } catch (err) {
    throw err.stdout || err.stderr
  }
}
