export const one = async (layoutId, pg) => pg.one(sql.one, [layoutId])
export const listByIds = async (layoutIds, pg) =>
  pg.manyOrNone(sql.listByIds, [layoutIds])

const sql = {
  one: `
    SELECT * FROM layouts WHERE id = $1
  `,
  listByIds: `
    SELECT * FROM layouts WHERE id IN ($1:csv)
  `,
}
