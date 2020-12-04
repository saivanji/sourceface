export const up = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      CREATE TYPE module AS ENUM ('button', 'container', 'input', 'table', 'text')
    `)
    await t.none(`
      CREATE TABLE modules(
        id uuid PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT NOW(),
        parent_id uuid REFERENCES modules(id) ON DELETE CASCADE,
        page_id integer NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
        name text NOT NULL CHECK (name <> ''),
        type module NOT NULL,
        config json NOT NULL,
        position json,
        UNIQUE (page_id, name)
      )
    `)
  })

export const down = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      DROP TABLE modules
    `)
    await t.none(`
      DROP TYPE module
    `)
  })
