export const getSchema = (pg) => pg.oneOrNone(sql.getSchema, (x) => x.data)

export const setSchema = (schema, pg) =>
  pg.one(sql.setSchema, [schema], (x) => x.data)

const sql = {
  getSchema: "SELECT data FROM values WHERE key = 'schema'",
  setSchema: `
    INSERT INTO values (key, data) VALUES ('schema', $1)
    ON CONFLICT (key) DO UPDATE SET data = $1
    RETURNING data
  `,
}
