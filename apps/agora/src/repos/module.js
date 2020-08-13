export const one = (moduleId, pg) => pg.one(sql.one, [moduleId])
export const create = (type, config, positionId, pg) =>
  pg.one(sql.create, [type, config, positionId])
export const updateConfig = (moduleId, config, pg) =>
  pg.one(sql.updateConfig, [moduleId, config])
export const listByPageIds = (pageIds, pg) =>
  pg.manyOrNone(sql.listByPageIds, [pageIds])

const sql = {
  one: `
    SELECT * FROM modules WHERE id = $1
  `,
  create: `
    INSERT INTO modules (type, config, position_id) VALUES ($1, $2, $3)
    RETURNING *
  `,
  updateConfig: `
    UPDATE modules SET config = $2 WHERE id = $1
    RETURNING *
  `,
  listByPageIds: `
    WITH recursive cte AS (
      SELECT m.*, pg.id AS page_id FROM modules AS m
      INNER JOIN positions AS p ON p.id = m.position_id
      INNER JOIN pages AS pg ON pg.layout_id = p.layout_id
      WHERE pg.id IN ($1:csv)

      UNION ALL

      SELECT m.*, cte.page_id FROM modules AS m
      INNER JOIN positions AS p ON p.id = m.position_id
      INNER JOIN modules_layouts AS ml ON ml.layout_id = p.layout_id
      INNER JOIN cte ON cte.id = ml.module_id
    ) SELECT * FROM cte
  `,
}
