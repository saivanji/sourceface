export default (db, pgp) =>
  db.tx(async t => {
    await t.none(
      pgp.helpers.insert(
        [
          {
            type: "text",
            position: {
              x: 1,
              y: 12,
              w: 1,
              h: 1,
            },
            config: {
              value: "Hello world",
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
            position: {
              x: 4,
              y: 12,
              w: 2,
              h: 3,
            },
            config: {
              value: "Hola!",
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
            position: {
              x: 6,
              y: 12,
              w: 2,
              h: 4,
            },
            config: {
              value: "Orders count is {{ ~commands.countOrders }}",
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
            position: {
              x: 0,
              y: 0,
              w: 9,
              h: 11,
            },
            config: {
              items: "~commands.listOrders limit, offset",
              count: "~commands.countOrders",
              limit: "10",
              pagination: true,
            },
          },
        ],
        new pgp.helpers.ColumnSet(["type", "position", "config"], {
          table: "modules",
        })
      )
    )
  })
