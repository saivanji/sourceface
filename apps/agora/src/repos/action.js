import { pgp, updateQuery, mergeableColumn } from "../postgres"

export const one = (actionId, pg) => pg.one(sql.one, [actionId])
export const create = (
  actionId,
  moduleId,
  order,
  field,
  type,
  name,
  config,
  pg
) => pg.one(sql.create, [actionId, moduleId, order, field, type, name, config])
export const update = (actionId, fields, pg) =>
  pg.one(sql.update(fields), [actionId])
export const remove = (actionId, pg) => pg.none(sql.remove, [actionId])
export const listByModuleIds = (moduleIds, pg) =>
  pg.manyOrNone(sql.listByModuleIds, [moduleIds])

const sql = {
  one: `
    SELECT * FROM actions WHERE id = $1
  `,
  create: `
    INSERT INTO actions (id, module_id, "order", field, type, name, config)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
  `,
  remove: `
    DELETE FROM actions WHERE id = $1
  `,
  listByModuleIds: `
    SELECT * FROM actions WHERE module_id IN ($1:csv)
  `,
  update: (data) =>
    updateQuery("id", "actions", data, { config: mergeableColumn }) +
    pgp.as.format(" WHERE id = ${id} RETURNING *", data),
}
