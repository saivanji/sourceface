import { keys } from "ramda"
import { pgp, mergeableColumn } from "../postgres"

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
export const updateMany = (data, pg) => pg.many(sql.update(data))
export const remove = (moduleId, pg) => pg.none(sql.remove, [moduleId])
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
  update: (data) =>
    pgp.helpers.update(
      data,
      new pgp.helpers.ColumnSet([
        "?id",
        ...keys(data).map((key) =>
          key === "config" ? mergeableColumn(key) : key
        ),
      ]),
      "modules",
      {
        emptyUpdate: sql.one,
      }
    ) + " RETURNING *",
}

// SELECT $1 AS id, $2 AS type, $3 AS config, $4 AS position_id,
// $2 || '_' || coalesce(max(cast(regexp_replace(name, $2 || '_(.*)', '\\1') AS integer)), 0) + 1 AS name
// FROM modules WHERE name LIKE $2 || '_%'
