import {
  pgp,
  mergeableColumn,
  castColumn,
  updateQuery,
  asCsvValues,
} from "../postgres"
import { getField, getIndex } from "../utils/reference"

export const one = (moduleId, pg) => pg.one(sql.one, [moduleId])
export const create = (
  moduleId,
  parentId,
  pageId,
  type,
  name,
  config,
  position,
  pg
) =>
  pg.one(sql.create, [moduleId, parentId, pageId, type, name, config, position])
export const update = (moduleId, data, pg) =>
  pg.one(sql.update({ id: moduleId, ...data }))
export const updateMany = (data, pg) => pg.many(sql.updateMany(data))
export const remove = (moduleId, pg) => pg.none(sql.remove, [moduleId])
export const listByReferenceIds = (refIds, pg) =>
  pg.manyOrNone(sql.listByReferenceIds, [asCsvValues(refIds)])
export const listByIds = (ids, pg) => pg.manyOrNone(sql.listByIds, [ids])
export const listByPageIds = (pageIds, pg) =>
  pg.manyOrNone(sql.listByPageIds, [pageIds])

const sql = {
  one: `
    SELECT * FROM modules WHERE id = $1
  `,
  create: `
    INSERT INTO modules (id, parent_id, page_id, type, name, config, position)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `,
  remove: `
    DELETE FROM modules WHERE id = $1
  `,
  listByIds: `
    SELECT * FROM modules WHERE id IN ($1:csv)
  `,
  listByPageIds: `
    SELECT * FROM modules WHERE page_id IN ($1:csv)
  `,
  listByReferenceIds: `
    SELECT m.*, r.action_id, ${getField("r.field")} AS field
    FROM "references" AS r
    LEFT JOIN modules AS m ON (m.id = r.module_id)
    WHERE (r.action_id, ${getField("r.field")}) IN ($1:raw)
    ORDER BY ${getIndex("r.field")} ASC
  `,
  update: (data) =>
    updateQuery("id", "modules", data, { config: mergeableColumn }) +
    pgp.as.format(" WHERE id = ${id} RETURNING *", data),
  updateMany: (data) =>
    updateQuery("id", "modules", data, {
      config: mergeableColumn,
      /**
       * It seems during batch updates such types has to be casted explicitly.
       */
      parentId: castColumn("uuid"),
      position: castColumn("json"),
    }) + " WHERE v.id::uuid = t.id RETURNING *",
}

// SELECT $1 AS id, $2 AS type, $3 AS config, $4 AS position_id,
// $2 || '_' || coalesce(max(cast(regexp_replace(name, $2 || '_(.*)', '\\1') AS integer)), 0) + 1 AS name
// FROM modules WHERE name LIKE $2 || '_%'
