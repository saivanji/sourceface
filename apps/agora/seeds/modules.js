export default (db, pgp) =>
  db.tx(async t => {
    await t.none(
      pgp.helpers.insert(
        [
          {
            type: "text",
            config: {
              value: "'Hello world'",
              fontSize: "sm",
              fontWeight: "semibold",
              alignmentX: "left",
              alignmentY: "baseline",
              decoration: "underline",
              color: "#000",
            },
          },
          {
            type: "text",
            config: {
              value: "'Hola!'",
              fontSize: "lg",
              fontWeight: "regular",
              alignmentX: "left",
              alignmentY: "baseline",
              decoration: "none",
              color: "#000",
            },
          },
          {
            type: "text",
            config: {
              value: "~commands.countOrders",
              fontSize: "base",
              fontWeight: "bold",
              alignmentX: "left",
              alignmentY: "baseline",
              decoration: "underline",
              color: "#000",
            },
          },
          {
            type: "table",
            config: {
              items: "~commands.listOrders limit, offset",
              count: "~commands.countOrders",
            },
          },
        ],
        new pgp.helpers.ColumnSet(["type", "config"], { table: "modules" })
      )
    )
  })
