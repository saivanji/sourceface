import { pgp } from "postgres.js"

export const create = (layoutId, position, pg) =>
  pg.one(sql.create, [layoutId, position])
export const listByIds = (positionIds, pg) =>
  pg.manyOrNone(sql.listByIds, [positionIds])
export const listByLayoutIds = (layoutIds, pg) =>
  pg.manyOrNone(sql.listByLayoutIds, [layoutIds])
export const batchUpdate = (positions, pg) =>
  pg.many(sql.batchUpdate(positions))

const sql = {
  create: `
    INSERT INTO positions (layout_id, position) VALUES ($1, $2)
    RETURNING *
  `,
  listByIds: `
    SELECT * FROM positions WHERE id IN ($1:csv)
  `,
  listByLayoutIds: `
    SELECT * FROM positions WHERE layout_id IN ($1:csv)
  `,
  batchUpdate: positions =>
    pgp.helpers.update(
      positions,
      new pgp.helpers.ColumnSet([
        "?id",
        { name: "layout_id", prop: "layoutId" },
        { name: "position", cast: "json" },
      ]),
      {
        table: "positions",
      }
    ) + " WHERE v.id = t.id RETURNING *",
}
