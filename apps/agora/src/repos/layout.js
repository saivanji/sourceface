export const one = (layoutId, pg) => pg.one(sql.one, [layoutId])
export const updatePositions = (layoutId, positions, pg) =>
  pg.one(sql.updatePositions, [layoutId, positions])
export const listByIds = (layoutIds, pg) =>
  pg.manyOrNone(sql.listByIds, [layoutIds])
export const listByModuleIds = (moduleIds, pg) =>
  pg.manyOrNone(sql.listByModuleIds, [moduleIds])

const sql = {
  one: `
    SELECT * FROM layouts WHERE id = $1
  `,
  updatePositions: `
    UPDATE layouts SET positions = $2 WHERE id = $1
    RETURNING *
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
