export const up = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      CREATE TYPE module AS ENUM ('button', 'container', 'input', 'table', 'text')
    `)
    // TODO: make sure modules are unique within a page
    await t.none(`
      CREATE TABLE modules(
        id uuid PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT NOW(),
        layout_id uuid NOT NULL REFERENCES layouts(id) ON DELETE CASCADE,
        name text NOT NULL CHECK (name <> ''),
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
        layout_id uuid UNIQUE NOT NULL REFERENCES layouts(id) ON DELETE CASCADE
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
