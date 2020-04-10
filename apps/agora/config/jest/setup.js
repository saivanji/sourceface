import postgres from "@@postgres"

const pg = postgres()

global.pg = pg

/**
 * Cleaning database before every test
 */
global.beforeEach(async () => {
  const tables = await pg.manyOrNone(
    `SELECT * FROM information_schema.tables WHERE table_schema = 'public'`
  )
  await Promise.all(
    tables
      .filter((item) => item.tableName !== "migrations")
      .map((item) => pg.none(`DELETE FROM ${item.tableName}`))
  )
})

global.afterAll(() => {
  pg.$pool.end()
})
