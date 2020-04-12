const emailRegex = "^.*$"

export const up = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      CREATE TABLE users(
        id serial PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT NOW(),
        username text NOT NULL UNIQUE CHECK (
          username <> '' AND
          length(username) > 1
        ),
        email text NOT NULL UNIQUE CHECK (
          email ~* '${emailRegex}'
        ),
        password text CHECK (
          password <> ''
        )
      )
    `)
  })

export const down = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      DROP TABLE users
    `)
  })
