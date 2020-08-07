export default db =>
  db.tx(async t => [
    await t.one("INSERT INTO layouts (id) VALUES (1) RETURNING *"),
  ])
