export default db =>
  db.tx(async t => {
    await t.none(
      `
      INSERT INTO modules (type, config)
      VALUES ('text', $1), ('text', $2)
      `,
      [
        {
          value: "Hello world",
        },
        {
          value: "Hola!",
        },
        {
          value: "Orders count is {{ queries.countOrders() }}",
          testVar: "queries.countOrders()",
        },
      ]
    )
  })
