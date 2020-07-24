export const all = async pg => await pg.manyOrNone(sql.all)
export const one = async (moduleId, pg) => await pg.one(sql.one, [moduleId])
export const create = async (type, config, pg) =>
  await pg.one(sql.create, [type, config])
export const updateConfig = async (moduleId, config, pg) =>
  await pg.one(sql.updateConfig, [moduleId, config])
export const updatePosition = async (moduleId, position, pg) =>
  await pg.one(sql.updatePosition, [moduleId, position])

const sql = {
  all: `
    SELECT * FROM modules
    ORDER BY id ASC
  `,
  one: `
    SELECT * FROM modules WHERE id = $1
  `,
  create: `
    INSERT INTO modules (type, config) VALUES ($1, $2)
    RETURNING *
  `,
  updateConfig: `
    UPDATE modules SET config = $2 WHERE id = $1
    RETURNING *
  `,
  updatePosition: `
    UPDATE modules SET position = $2 WHERE id = $1
    RETURNING *
  `,
}
