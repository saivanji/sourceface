export const up = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      CREATE TABLE sessions(
        sid varchar NOT NULL COLLATE "default",
        sess json NOT NULL,
        expire timestamp(6) NOT NULL
      ) WITH (OIDS=FALSE);
    `)

    await t.none(`
      ALTER TABLE "sessions" ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
    `)

    await t.none(`
      CREATE INDEX "IDX_session_expire" ON "sessions" ("expire");
    `)
  })

export const down = () =>
  global.pg.tx(async (t) => {
    await t.none(`
      DROP TABLE sessions
    `)
  })
