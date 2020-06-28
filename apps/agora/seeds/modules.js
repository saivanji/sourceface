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
              value:
                "queries.countOrders().then(data => `Orders count is ${data.count}`)",
            },
          },
          {
            type: "table",
            config: {
              items:
                "queries.listOrders({limit: itemsPerPage, offset: itemsPerPage * page})",
              count: "queries.countOrders().then(res => res.count)",
            },
          },
        ],
        new pgp.helpers.ColumnSet(["type", "config"], { table: "modules" })
      )
    )
  })
