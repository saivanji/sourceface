export default (db, pgp, { layouts }) =>
  db.tx(async t => {
    const layoutId = layouts[0].id

    await createModule(
      layoutId,
      "text",
      createTextConfig("Hello"),
      [1, 12, 1, 1],
      t
    )

    await createModule(
      layoutId,
      "text",
      createTextConfig("Hola"),
      [4, 12, 2, 3],
      t
    )

    await createModule(
      layoutId,
      "text",
      createTextConfig("Orders count is {{ ~commands.countOrders }}"),
      [6, 12, 2, 4],
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
      [0, 0, 9, 11],
      t
    )

    await createContainerModule(
      layoutId,
      async layoutId => [
        await createModule(
          layoutId,
          "text",
          createTextConfig("Hello 1"),
          [1, 1, 1, 1],
          t
        ),
        await createModule(
          layoutId,
          "text",
          createTextConfig("Hello 2"),
          [2, 2, 1, 1],
          t
        ),
        await createContainerModule(
          layoutId,
          async layoutId => [
            await createModule(
              layoutId,
              "text",
              createTextConfig("Hello 3"),
              [2, 2, 1, 1],
              t
            ),
            await createContainerModule(
              layoutId,
              async layoutId => [
                await createModule(
                  layoutId,
                  "text",
                  createTextConfig("Hello 1"),
                  [2, 2, 2, 2],
                  t
                ),
                await createModule(
                  layoutId,
                  "text",
                  createTextConfig("Hello 2"),
                  [4, 3, 2, 2],
                  t
                ),
              ],
              [1, 1, 5, 5],
              t
            ),
          ],
          [1, 3, 8, 6],
          t
        ),
      ],
      [0, 16, 10, 8],
      t
    )
  })

const attachLayout = (layoutId, moduleId, db) =>
  db.none(
    "INSERT INTO modules_layouts (layout_id, module_id) VALUES ($1, $2)",
    [layoutId, moduleId]
  )

const createModule = async (layoutId, type, config, [x, y, w, h], db) => {
  const {
    id: positionId,
  } = await db.one(
    "INSERT INTO positions (layout_id, position) VALUES ($1, $2) RETURNING id",
    [layoutId, { x, y, w, h }]
  )

  const {
    id,
  } = await db.one(
    "INSERT INTO modules (position_id, type, config) VALUES ($1, $2, $3) RETURNING id",
    [positionId, type, config]
  )

  return id
}

const createLayout = async db => {
  const { id } = await db.one(
    "INSERT INTO layouts (id) VALUES (nextval('layouts_id_seq')) RETURNING *"
  )

  return id
}

const createContainerModule = async (
  parentLayoutId,
  createChildModules,
  position,
  db
) => {
  const layoutId = await createLayout(db)

  await createChildModules(layoutId, db)

  const moduleId = await createModule(
    parentLayoutId,
    "container",
    {
      layoutId,
    },
    position,
    db
  )

  await attachLayout(layoutId, moduleId, db)

  return moduleId
}

const createTextConfig = value => ({
  text: value,
  fontSize: "sm",
  fontWeight: "semibold",
  alignmentX: "left",
  alignmentY: "baseline",
  decoration: "underline",
  color: "#000",
})
