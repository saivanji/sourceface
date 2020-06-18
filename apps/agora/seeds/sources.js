const { POSTGRES_MOCK_URL } = process.env

export default db =>
  db.tx(async t => {
    const { id } = await t.one(
      `
      INSERT INTO sources (database, name, connection)
      VALUES ('postgres', 'main database', $1)
      RETURNING id
    `,
      [POSTGRES_MOCK_URL]
    )
    await t.none(
      `
      INSERT INTO queries (source_id, name, value)
      VALUES ($1, 'orders list', 'SELECT * FROM orders')
    `,
      [id]
    )
  })
