export const one = (moduleId, pg) => pg.one(sql.one, [moduleId])
export const create = (moduleId, type, name, config, pg) =>
  pg.one(sql.create, [moduleId, type, name, config])
export const remove = (moduleId, pg) => pg.none(sql.remove, [moduleId])
export const updateConfig = (moduleId, config, pg) =>
  pg.one(sql.updateConfig, [moduleId, config])
export const listByPageIds = (pageIds, pg) =>
  pg.manyOrNone(sql.listByPageIds, [pageIds])

const sql = {
  one: `
    SELECT * FROM modules WHERE id = $1
  `,
  create: `
    INSERT INTO modules (id, type, name, config)
    RETURNING *
  `,
  remove: `
    DELETE FROM modules WHERE id = $1
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

// SELECT $1 AS id, $2 AS type, $3 AS config, $4 AS position_id,
// $2 || '_' || coalesce(max(cast(regexp_replace(name, $2 || '_(.*)', '\\1') AS integer)), 0) + 1 AS name
// FROM modules WHERE name LIKE $2 || '_%'
