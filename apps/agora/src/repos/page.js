export const one = async (pageId, pg) => await pg.one(sql.one, [pageId])

const sql = {
  one: `
    SELECT * FROM pages WHERE id = $1
  `,
}
