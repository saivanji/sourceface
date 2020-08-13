export const one = async (layoutId, pg) => pg.one(sql.one, [layoutId])
export const listByIds = async (layoutIds, pg) =>
  pg.manyOrNone(sql.listByIds, [layoutIds])
export const listByModuleIds = async (moduleIds, pg) =>
  pg.manyOrNone(sql.listByModuleIds, [moduleIds])

const sql = {
  one: `
    SELECT * FROM layouts WHERE id = $1
  `,
  listByIds: `
    SELECT * FROM layouts WHERE id IN ($1:csv)
  `,
  listByModuleIds: `
    SELECT l.*, ml.module_id FROM layouts AS l
    INNER JOIN modules_layouts AS ml ON (ml.layout_id = l.id)
    WHERE ml.module_id IN ($1:csv)
  `,
}
