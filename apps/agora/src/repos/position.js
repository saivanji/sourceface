import { pgp } from "postgres.js"

export const listByLayoutIds = (layoutIds, pg) =>
  pg.manyOrNone(sql.listByLayoutIds, [layoutIds])
export const deleteByLayoutId = (layoutId, pg) =>
  pg.none(sql.deleteByLayoutId, [layoutId])
export const batchInsert = (positions, pg) =>
  pg.many(sql.batchInsert(positions))

const sql = {
  listByLayoutIds: `
    SELECT * FROM positions WHERE layout_id IN ($1:csv)
  `,
  deleteByLayoutId: `
    DELETE FROM positions WHERE layout_id = $1
  `,
  batchInsert: positions =>
    pgp.helpers.insert(
      positions,
      new pgp.helpers.ColumnSet(["id", "layout_id", "position"]),
      {
        table: "positions",
      }
    ) + " RETURNING *",
}
