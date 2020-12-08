const references = ["pages", "operations", "modules"]

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

    for (let name of references) {
      await t.none(`
        CREATE TABLE actions_${name}_refs(
          action_id uuid NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
          reference_id int NOT NULL REFERENCES ${name}(id) ON DELETE RESTRICT,
          field text NOT NULL CHECK (field ~ '^[a-zA-Z]+(/[0-9]+)?$'),
          UNIQUE (action_id, field)
        )
      `)
    }
  })

export const down = () =>
  global.pg.tx(async (t) => {
    for (let name of references) {
      await t.none(`
        DROP TABLE actions_${name}_refs
      `)
    }

    await t.none(`
      DROP TABLE actions
    `)
    await t.none(`
      DROP TYPE action
    `)
  })
