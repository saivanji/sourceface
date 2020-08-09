export const one = async (moduleId, pg) => await pg.one(sql.one, [moduleId])
export const create = async (type, config, positionId, pg) =>
  await pg.one(sql.create, [type, config, positionId])
export const updateConfig = async (moduleId, config, pg) =>
  await pg.one(sql.updateConfig, [moduleId, config])
export const listByPositionIds = async (positionIds, pg) =>
  await pg.manyOrNone(sql.listByPositionIds, [positionIds])

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
  listByPositionIds: `
    SELECT * FROM modules WHERE position_id IN ($1:csv)
  `,
}
