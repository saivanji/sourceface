export const up = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      CREATE TABLE permissions(
        id serial PRIMARY KEY,
        name text NOT NULL UNIQUE CHECK (
          name ~* '^[A-Z_]+$'
        ),
        is_system boolean NOT NULL
      )
    `)
    await t.none(`
      CREATE TABLE roles_permissions(
        role_id integer NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        permission_id integer NOT NULL REFERENCES permissions(id) ON DELETE CASCADE
      )
    `)
  })

export const down = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      DROP TABLE roles_permissions
    `)
    await t.none(`
      DROP TABLE permissions
    `)
  })
