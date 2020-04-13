export const up = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      CREATE TABLE roles(
        id serial PRIMARY KEY,
        name text NOT NULL UNIQUE CHECK (
          name <> '' AND
          length(name) > 1
        ),
        is_privileged boolean NOT NULL
      )
    `)
    await t.none(`
      ALTER TABLE users
      ADD COLUMN role_id integer NOT NULL REFERENCES roles(id) ON DELETE RESTRICT
    `)
  })

export const down = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      ALTER TABLE users DROP COLUMN role_id
    `)
    await t.none(`
      DROP TABLE roles
    `)
  })
