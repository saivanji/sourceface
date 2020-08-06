export const up = () =>
  global.pg.tx(async t => {
    await t.none(`
      CREATE TABLE pages(
        id serial NOT NULL,
        created_at timestamp NOT NULL DEFAULT NOW(),
        layout_id integer REFERENCES layouts(id) ON DELETE RESTRICT,
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
