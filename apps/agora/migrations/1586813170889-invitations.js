const emailRegex = "^.*$"

export const up = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      CREATE TABLE invitations(
        id text NOT NULL UNIQUE,
        created_at timestamp NOT NULL DEFAULT NOW(),
        expires_at timestamp NOT NULL,
        email text NOT NULL CHECK (
          email ~* '${emailRegex}'
        ),
        role_id integer NOT NULL REFERENCES roles(id) ON DELETE RESTRICT
      )
    `)
  })

export const down = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      DROP TABLE invitations
    `)
  })
