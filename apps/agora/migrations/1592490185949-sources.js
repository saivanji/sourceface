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
      CREATE TABLE commands(
        id serial PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT NOW(),
        name text NOT NULL CHECK (name <> ''),
        source_id integer NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
        config json NOT NULL
      )
    `)
    await t.none(`
      CREATE TABLE stale_commands(
        command_id integer NOT NULL REFERENCES commands(id) ON DELETE CASCADE,
        stale_id integer NOT NULL REFERENCES commands(id) ON DELETE CASCADE,
        UNIQUE (command_id, stale_id)
      )
    `)
  })

export const down = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      DROP TABLE stale_commands
    `)
    await t.none(`
      DROP TABLE commands
    `)
    await t.none(`
      DROP TABLE sources
    `)
    await t.none(`
      DROP TYPE source
    `)
  })
