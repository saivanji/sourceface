export const one = async (moduleId, pg) => await pg.one(sql.one, [moduleId])
export const create = async (type, config, positionId, pg) =>
  await pg.one(sql.create, [type, config, positionId])
export const updateConfig = async (moduleId, config, pg) =>
  await pg.one(sql.updateConfig, [moduleId, config])
export const listByPageIds = async (pageIds, pg) =>
  await pg.manyOrNone(sql.listByPageIds, [pageIds])

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
    SELECT m.*, pg.id AS page_id FROM modules AS m
    INNER JOIN positions AS p ON (p.id = m.position_id)
    INNER JOIN pages AS pg ON (pg.layout_id = p.layout_id)
    WHERE pg.id IN ($1:csv)
  `,
}
