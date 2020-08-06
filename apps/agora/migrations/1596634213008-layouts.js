export const up = () =>
  global.pg.tx(async t => {
    await t.none(`
      CREATE TYPE layout AS ENUM ('page', 'module')
    `)

    await t.none(`
      CREATE TABLE layouts(
        id serial NOT NULL,
        created_at timestamp NOT NULL DEFAULT NOW(),
        type layout NOT NULL,
      )
    `)
  })

export const down = () =>
  global.pg.tx(async t => {
    await t.none(`
      DROP TABLE layouts
    `)
    await t.none(`
      DROP TYPE layout
    `)
  })
