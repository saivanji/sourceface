import { keys } from "ramda"
import { pgp, mergeableColumn } from "../postgres"

export const one = (moduleId, pg) => pg.one(sql.one, [moduleId])
export const create = (moduleId, layoutId, type, name, config, pg) =>
  pg.one(sql.create, [moduleId, layoutId, type, name, config])
export const update = (moduleId, fields, pg) =>
  pg.one(sql.update(fields), [moduleId])
export const remove = (moduleId, pg) => pg.none(sql.remove, [moduleId])
export const listByPageIds = (pageIds, pg) =>
  pg.manyOrNone(sql.listByPageIds, [pageIds])

const sql = {
  one: `
    SELECT * FROM modules WHERE id = $1
  `,
  create: `
    INSERT INTO modules (id, layout_id, type, name, config)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `,
  remove: `
    DELETE FROM modules WHERE id = $1
  `,
  listByPageIds: `
    WITH recursive cte AS (
      SELECT m.*, pg.id AS page_id FROM modules AS m
      INNER JOIN pages AS pg ON pg.layout_id = m.layout_id
      WHERE pg.id IN ($1:csv)

      UNION ALL

      SELECT m.*, cte.page_id FROM modules AS m
      INNER JOIN modules_layouts AS ml ON ml.layout_id = m.layout_id
      INNER JOIN cte ON cte.id = ml.module_id
    ) SELECT * FROM cte
  `,
  update: (fields) =>
    pgp.helpers.update(
      fields,
      new pgp.helpers.ColumnSet(
        keys(fields).map((key) =>
          key === "config" ? mergeableColumn(key) : key
        )
      ),
      "modules",
      {
        emptyUpdate: sql.one,
      }
    ) + " WHERE id = $1 RETURNING *",
}

// SELECT $1 AS id, $2 AS type, $3 AS config, $4 AS position_id,
// $2 || '_' || coalesce(max(cast(regexp_replace(name, $2 || '_(.*)', '\\1') AS integer)), 0) + 1 AS name
// FROM modules WHERE name LIKE $2 || '_%'
