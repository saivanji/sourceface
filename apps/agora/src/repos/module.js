export const all = async pg => pg.manyOrNone(sql.all)

const sql = {
  all: `
    SELECT * FROM modules
  `,
}
