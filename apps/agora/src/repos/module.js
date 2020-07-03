export const all = async pg => await pg.manyOrNone(sql.all)
export const one = async (moduleId, pg) => await pg.one(sql.one, [moduleId])
export const updateConfig = async (moduleId, config, pg) =>
  await pg.one(sql.updateConfig, [moduleId, config])

const sql = {
  all: `
    SELECT * FROM modules
    ORDER BY id ASC
  `,
  one: `
    SELECT * FROM modules WHERE id = $1
  `,
  updateConfig: `
    UPDATE modules SET config = $2 WHERE id = $1
    RETURNING *
  `,
}
