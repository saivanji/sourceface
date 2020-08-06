export const up = () =>
  global.pg.tx(async t => {
    await t.none(`
      CREATE TYPE module AS ENUM ('text', 'table')
    `)
    await t.none(`
      CREATE TABLE modules(
        id serial NOT NULL,
        created_at timestamp NOT NULL DEFAULT NOW(),
        layout_id integer REFERENCES layouts(id) ON DELETE RESTRICT,
        type module NOT NULL,
        position json NOT NULL,
        config json NOT NULL
      )
    `)
    // for the case when module may have child layouts (tabs, sections and so on)
    await t.none(`
      CREATE TABLE modules_layouts(
        module_id integer REFERENCES modules(id) ON DELETE CASCADE,
        layout_id integer REFERENCES layouts(id) ON DELETE RESTRICT
      )
    `)
  })

export const down = () =>
  global.pg.tx(async t => {
    await t.none(`
      DROP TABLE modules_layouts
    `)
    await t.none(`
      DROP TABLE modules
    `)
    await t.none(`
      DROP TYPE module
    `)
  })
