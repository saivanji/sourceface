export const up = () =>
  global.pg.tx(async t => {
    await t.none(`
      CREATE TYPE module AS ENUM ('text', 'table')
    `)
    await t.none(`
      CREATE TABLE modules(
        id serial NOT NULL,
        created_at timestamp NOT NULL DEFAULT NOW(),
        type module NOT NULL,
        config json NOT NULL
      )
    `)
  })

export const down = () =>
  global.pg.tx(async t => {
    await t.none(`
      DROP TABLE modules
    `)
    await t.none(`
      DROP TYPE module
    `)
  })
