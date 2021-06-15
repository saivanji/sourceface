export const up = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      CREATE TYPE source AS ENUM ('postgres')
    `)
    await t.none(`
      CREATE TABLE sources(
        id serial PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT NOW(),
        name text NOT NULL CHECK (name <> ''),
        type source NOT NULL,
        config json NOT NULL
      )
    `)
    await t.none(`
      CREATE TABLE operations(
        id serial PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT NOW(),
        name text NOT NULL CHECK (name <> ''),
        source_id integer NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
        config json NOT NULL
      )
    `)
    await t.none(`
      CREATE TABLE stale_operations(
        command_id integer NOT NULL REFERENCES operations(id) ON DELETE CASCADE,
        stale_id integer NOT NULL REFERENCES operations(id) ON DELETE CASCADE,
        UNIQUE (command_id, stale_id)
      )
    `)
  })

export const down = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      DROP TABLE stale_operations
    `)
    await t.none(`
      DROP TABLE operations
    `)
    await t.none(`
      DROP TABLE sources
    `)
    await t.none(`
      DROP TYPE source
    `)
  })
