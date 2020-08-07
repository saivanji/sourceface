export const up = () =>
  global.pg.tx(async t => {
    await t.none(`
      CREATE TABLE layouts(
        id serial PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT NOW()
      )
    `)

    await t.none(`
      CREATE TABLE positions(
        id serial PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT NOW()
        layout_id integer NOT NULL REFERENCES layouts(id) ON DELETE CASCADE,
        position json NOT NULL
      )
    `)
  })

export const down = () =>
  global.pg.tx(async t => {
    await t.none(`
      DROP TABLE positions
    `)
    await t.none(`
      DROP TABLE layouts
    `)
  })
