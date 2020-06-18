export const byId = async (queryId, pg) => pg.one(sql.byId, [queryId])

const sql = {
  byId: `
    SELECT * FROM queries
    WHERE id = $1
  `,
}
