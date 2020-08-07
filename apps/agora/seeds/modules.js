export default (db, pgp, { layouts }) =>
  db.tx(async t => {
    const layoutId = layouts[0].id

    await createModule(
      layoutId,
      "text",
      {
        value: "Hello world",
        fontSize: "sm",
        fontWeight: "semibold",
        alignmentX: "left",
        alignmentY: "baseline",
        decoration: "underline",
        color: "#000",
      },
      {
        x: 1,
        y: 12,
        w: 1,
        h: 1,
      },
      t
    )

    await createModule(
      layoutId,
      "text",
      {
        value: "Hola!",
        fontSize: "lg",
        fontWeight: "regular",
        alignmentX: "left",
        alignmentY: "baseline",
        decoration: "none",
        color: "#000",
      },
      {
        x: 4,
        y: 12,
        w: 2,
        h: 3,
      },
      t
    )

    await createModule(
      layoutId,
      "text",
      {
        value: "Orders count is {{ ~commands.countOrders }}",
        fontSize: "base",
        fontWeight: "bold",
        alignmentX: "left",
        alignmentY: "baseline",
        decoration: "underline",
        color: "#000",
      },
      {
        x: 6,
        y: 12,
        w: 2,
        h: 4,
      },
      t
    )

    await createModule(
      layoutId,
      "table",
      {
        items: "~commands.listOrders limit, offset",
        count: "~commands.countOrders",
        limit: "10",
        pagination: true,
      },
      {
        x: 0,
        y: 0,
        w: 9,
        h: 11,
      },
      t
    )
  })

const createModule = async (layoutId, type, config, position, db) => {
  const {
    id: positionId,
  } = await db.one(
    "INSERT INTO positions (layout_id, position) VALUES ($1, $2) RETURNING id",
    [layoutId, position]
  )

  await db.none(
    "INSERT INTO modules (position_id, type, config) VALUES ($1, $2, $3)",
    [positionId, type, config]
  )
}
