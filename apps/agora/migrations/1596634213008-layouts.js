export const up = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      CREATE TABLE layouts(
        id uuid PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT NOW(),
        positions json NOT NULL
      )
    `)
  })

export const down = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      DROP TABLE layouts
    `)
  })
