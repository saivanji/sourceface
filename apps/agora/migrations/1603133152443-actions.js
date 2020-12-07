export const up = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      CREATE TYPE action AS ENUM ('debug', 'function', 'operation', 'redirect')
    `)
    await t.none(`
      CREATE TABLE actions(
        id uuid PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT NOW(),
        module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
        "order" integer NOT NULL,
        field text NOT NULL CHECK (field <> ''),
        name text CHECK (name <> ''),
        type action NOT NULL,
        config json NOT NULL,
        UNIQUE ("order", module_id, field)
      )
    `)
    await t.none(`
      CREATE TABLE actions_pages(
        action_id uuid NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
        reference_id int NOT NULL REFERENCES pages(id) ON DELETE RESTRICT,
        field text NOT NULL CHECK (field <> ''),
        UNIQUE (action_id, field)
      )
    `)
    await t.none(`
      CREATE TABLE actions_operations(
        action_id uuid NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
        reference_id int NOT NULL REFERENCES commands(id) ON DELETE RESTRICT,
        field text NOT NULL CHECK (field <> ''),
        UNIQUE (action_id, field)
      )
    `)
    await t.none(`
      CREATE TABLE actions_modules(
        action_id uuid NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
        reference_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
        field text NOT NULL CHECK (field <> ''),
        UNIQUE (action_id, field)
      )
    `)
  })

export const down = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      DROP TABLE actions_modules
    `)
    await t.none(`
      DROP TABLE actions_operations
    `)
    await t.none(`
      DROP TABLE actions_pages
    `)
    await t.none(`
      DROP TABLE actions
    `)
    await t.none(`
      DROP TYPE action
    `)
  })
