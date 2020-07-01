export default (db, pgp) =>
  db.tx(async t => {
    await t.none(
      pgp.helpers.insert(
        [
          {
            type: "text",
            config: {
              value: "'Hello world'",
            },
          },
          {
            type: "text",
            config: {
              value: "'Hola!'",
            },
          },
          {
            type: "text",
            config: {
              value: "`Orders count is ${await commands.countOrders()}`",
            },
          },
          {
            type: "table",
            config: {
              items: "commands.listOrders({limit, offset})",
              count: "commands.countOrders()",
            },
          },
        ],
        new pgp.helpers.ColumnSet(["type", "config"], { table: "modules" })
      )
    )
  })
