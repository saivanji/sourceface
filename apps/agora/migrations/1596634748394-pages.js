export const up = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      CREATE TABLE pages(
        id serial PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT NOW(),
        route text UNIQUE NOT NULL,
        title text NOT NULL CHECK (
          title <> ''
        )
      )
    `)
  })

export const down = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      DROP TABLE pages
    `)
  })
