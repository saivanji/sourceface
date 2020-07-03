const { POSTGRES_MOCK_URL } = process.env

export default db =>
  db.tx(async t => {
    const { id } = await t.one(
      `
      INSERT INTO sources (id, type, config)
      VALUES ('pg', 'postgres', $1)
      RETURNING id
      `,
      [
        {
          connection: POSTGRES_MOCK_URL,
        },
      ]
    )
    await t.none(
      `
      INSERT INTO commands (id, source_id, config)
      VALUES ('listOrders', $1, $2), ('countOrders', $1, $3)
      `,
      [
        id,
        {
          value: "`SELECT * FROM orders LIMIT ${limit} OFFSET ${offset}`",
          result: "many",
        },
        {
          value: "`SELECT count(id)::integer FROM orders`",
          result: "single",
          compute: "result => result.count",
        },
      ]
    )
  })
