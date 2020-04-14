export const up = () =>
  global.pg.tx(async (t) => {
    // - should have only one privileged role
    // - could not remove privileged role
    await t.none(`
      CREATE TABLE roles(
        id serial PRIMARY KEY,
        created_at timestamp NOT NULL DEFAULT NOW(),
        name text NOT NULL UNIQUE CHECK (
          name = lower(name)
        ),
        is_privileged boolean NOT NULL DEFAULT false
      )
    `)
    // Raising exception according to that answer - https://stackoverflow.com/a/22600394/10788188
    await t.none(`
      CREATE FUNCTION restrict_privileged_role_deletion() RETURNS trigger AS $restrict_privileged_role_deletion$
        BEGIN
          IF OLD.is_privileged = true THEN
            RAISE EXCEPTION USING ERRCODE = 'S3GA0', MESSAGE = 'Can not delete privileged role';
          END IF;
          RETURN OLD;
        END;
      $restrict_privileged_role_deletion$ LANGUAGE plpgsql;
    `)
    await t.none(`
      CREATE TRIGGER restrict_privileged_role_deletion BEFORE DELETE ON roles
      FOR EACH ROW EXECUTE PROCEDURE restrict_privileged_role_deletion()
    `)
    await t.none(`
      CREATE UNIQUE INDEX single_true_is_privileged ON roles(is_privileged) 
      WHERE is_privileged = true
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
      DROP UNIQUE INDEX single_true_is_privileged
    `)
    await t.none(`
      DROP TRIGGER restrict_privileged_role_deletion ON roles
    `)
    await t.none(`
      DROP FUNCTION restrict_privileged_role_deletion()
    `)
    await t.none(`
      DROP TABLE roles
    `)
  })
