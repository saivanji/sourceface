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
        config json
        references json
      )
    `)
  })

export const down = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      DROP TABLE actions
    `)
    await t.none(`
      DROP TYPE action
    `)
  })
