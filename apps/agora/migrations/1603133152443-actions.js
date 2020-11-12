export const up = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      CREATE TYPE action AS ENUM ('operation', 'redirect')
    `)
    await t.none(`
      CREATE TABLE actions(
        id uuid PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT NOW(),
        module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
        name text CHECK (name <> ''),
        type action NOT NULL,
        config json NOT NULL
      )
    `)
    await t.none(`
      CREATE TABLE actions_pages(
        action_id uuid NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
        page_id int NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
        UNIQUE (action_id, page_id)
      )
    `)
    await t.none(`
      CREATE TABLE actions_commands(
        action_id uuid NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
        command_id int NOT NULL REFERENCES commands(id) ON DELETE CASCADE,
        UNIQUE (action_id, command_id)
      )
    `)
  })

export const down = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      DROP TABLE actions_commands
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
