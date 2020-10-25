export const one = (actionId, pg) => pg.one(sql.one, [actionId])
export const create = (moduleId, type, config, pg) =>
  pg.one(sql.create, [moduleId, type, config])
export const rename = (actionId, name, pg) =>
  pg.one(sql.rename, [actionId, name])
export const remove = (actionId, pg) =>
  pg.none(sql.remove, [actionId])
export const updateConfig = (actionId, config, pg) =>
  pg.one(sql.updateConfig, [actionId, config])
export const listByModuleIds = (moduleIds, pg) =>
  pg.manyOrNone(sql.listByModuleIds, [moduleIds])

const sql = {
  one: `
    SELECT * FROM actions WHERE id = $1
  `,
  create: `
    INSERT INTO actions (module_id, type, config) VALUES ($1, $2, $3)
    RETURNING *
  `,
  rename: `
    UPDATE actions SET name = $2 WHERE id = $1
    RETURNING *
  `,
  remove: `
    DELETE FROM actions WHERE id = $1
  `,
  updateConfig: `
    UPDATE actions SET config = $2 WHERE id = $1
    RETURNING *
  `,
  listByModuleIds: `
    SELECT * FROM actions WHERE module_id IN ($1:csv)
  `,
}
