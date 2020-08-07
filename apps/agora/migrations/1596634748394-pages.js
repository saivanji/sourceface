export const up = () =>
  global.pg.tx(async t => {
    await t.none(`
      CREATE TABLE pages(
        id serial PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT NOW(),
        layout_id integer UNIQUE NOT NULL REFERENCES layouts(id) ON DELETE CASCADE,
        title text NOT NULL CHECK (
          title <> ''
        )
      )
    `)
  })

export const down = () =>
  global.pg.tx(async t => {
    await t.none(`
      DROP TABLE pages
    `)
  })
