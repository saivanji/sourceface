export default db =>
  db.tx(
    async t =>
      /**
       * TODO: return ids as named object so they can be referenced by module seeds
       */
      await t.many(
        "INSERT INTO layouts (id) VALUES (nextval('layouts_id_seq')) RETURNING *"
      )
  )
