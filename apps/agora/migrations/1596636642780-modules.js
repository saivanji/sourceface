export const up = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      CREATE TYPE module AS ENUM ('button', 'container', 'input', 'table', 'text')
    `)
    await t.none(`
      CREATE TABLE modules(
        id uuid PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT NOW(),
        name text NOT NULL CHECK (name <> ''),
        position_id integer UNIQUE NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
        type module NOT NULL,
        config json NOT NULL
      )
    `)
    /**
     * For the case when module may have child layouts (tabs, sections and so on).
     */
    await t.none(`
      CREATE TABLE modules_layouts(
        module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
        layout_id integer UNIQUE NOT NULL REFERENCES layouts(id) ON DELETE CASCADE
      )
    `)
  })

export const down = () =>
  global.pg.tx(async (t) => {
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
