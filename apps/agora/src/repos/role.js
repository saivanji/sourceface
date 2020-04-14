export const create = (name, isPrivileged, pg) =>
  pg.one(sql.create, [name, isPrivileged])

export const list = (ids, pg) => pg.manyOrNone(sql.list, [ids])

export const byUserId = async (userId, pg) =>
  await pg.one(sql.byUserId, [userId])

const sql = {
  create: `
    INSERT INTO roles (name, is_privileged)
    VALUES ($1, $2)
    RETURNING *
  `,
  list: `
    SELECT * FROM roles
    WHERE id IN ($1:csv)
  `,
  byUserId: `
    SELECT r.* AS result FROM roles AS r
    INNER JOIN users AS u ON (u.role_id = r.id)
    WHERE u.id = $1
  `,
}
