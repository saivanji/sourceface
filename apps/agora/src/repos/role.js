import { pgp } from "postgres/index"

export const create = async (name, isPrivileged, pg) => {
  try {
    return await pg.one(sql.create, [name.toLowerCase(), isPrivileged])
  } catch (err) {
    if (err.constraint === "roles_name_key") {
      throw new Error("Role with such name already exists")
    }

    throw err
  }
}

export const list = (ids, pg) => pg.manyOrNone(sql.list, [ids])

export const byUserId = async (userId, pg) =>
  await pg.one(sql.byUserId, [userId])

export const remove = async (roleId, pg) => await pg.none(sql.remove, [roleId])

export const update = async (data, roleId, pg) => {
  const hasData = !!Object.keys(data).length

  return pg.one(
    hasData
      ? pgp.helpers.update(data, null, "roles") + " WHERE id = $1 RETURNING *"
      : sql.byId,
    [roleId]
  )
}

const sql = {
  byId: `
    SELECT * FROM roles
    WHERE id = $1
  `,
  byUserId: `
    SELECT r.* AS result FROM roles AS r
    INNER JOIN users AS u ON (u.role_id = r.id)
    WHERE u.id = $1
  `,
  create: `
    INSERT INTO roles (name, is_privileged)
    VALUES ($1, $2)
    RETURNING *
  `,
  list: `
    SELECT * FROM roles
    WHERE id IN ($1:csv)
  `,
  remove: `
    DELETE FROM roles
    WHERE id = $1
  `,
}
