// TODO: rename "database" to "type"
// TODO: rename "connection" to "settings" JSON type in future? Settings will depend on type.
// have settings on both queries and sources?
export const up = () =>
  global.pg.tx(async t => {
    await t.none(`
      CREATE TABLE sources(
        id serial PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT NOW(),
        database text NOT NULL CHECK (
          database = 'postgres'
        ),
        name text NOT NULL CHECK (
          name <> ''
        ),
        connection text NOT NULL CHECK (
          connection <> ''
        )
      )
    `)
    await t.none(`
      CREATE TABLE queries(
        id serial PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT NOW(),
        source_id integer NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
        name text NOT NULL CHECK (
          name <> ''
        ),
        value text NOT NULL CHECK (
          value <> ''
        )
      )
    `)
  })

export const down = () =>
  global.pg.tx(async t => {
    await t.none(`
      DROP TABLE queries
    `)
    await t.none(`
      DROP TABLE sources
    `)
  })
