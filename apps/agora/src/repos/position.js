import { pgp } from "postgres.js"

export const listByLayoutIds = (layoutIds, pg) =>
  pg.manyOrNone(sql.listByLayoutIds, [layoutIds])
export const batchUpdate = (positions, pg) =>
  pg.many(sql.batchUpdate(positions))

const sql = {
  listByLayoutIds: `
    SELECT * FROM positions WHERE layout_id IN ($1:csv)
  `,
  batchUpdate: positions =>
    pgp.helpers.update(
      positions,
      new pgp.helpers.ColumnSet([
        "?id",
        "layout_id",
        { name: "position", cast: "json" },
      ]),
      {
        table: "positions",
      }
    ) + " WHERE v.id = t.id RETURNING *",
}
