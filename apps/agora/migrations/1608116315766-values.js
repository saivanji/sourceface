export const up = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      CREATE TABLE values(
        key text UNIQUE NOT NULL,
        data text NOT NULL
      )
    `)
  })

export const down = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      DROP TABLE values
    `)
  })
