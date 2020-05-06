import { pgp } from "postgres.js"

export const create = async (name, pg) => {
  try {
    return await pg.one(sql.create, [name.toUpperCase()])
  } catch (err) {
    if (err.constraint === "permissions_name_key") {
      throw new Error("Permission with such name already exists")
    }

    throw err
  }
}

export const byIds = (ids, pg) => pg.manyOrNone(sql.byIds, [ids])

export const remove = async (permissionId, pg) =>
  await pg.none(sql.remove, [permissionId])

export const update = async (data, permissionId, pg) => {
  const hasData = !!Object.keys(data).length

  return pg.one(
    hasData
      ? pgp.helpers.update(data, null, "permissions") +
          " WHERE id = $1 RETURNING *"
      : sql.byId,
    [permissionId]
  )
}

export const list = async (limit, offset, pg) =>
  await pg.manyOrNone(sql.list, [limit, offset])

const sql = {
  byId: `
    SELECT * FROM permissions
    WHERE id = $1
  `,
  create: `
    INSERT INTO permissions (name)
    VALUES ($1)
    RETURNING *
  `,
  byIds: `
    SELECT * FROM permissions
    WHERE id IN ($1:csv)
  `,
  remove: `
    DELETE FROM permissions
    WHERE id = $1
  `,
  list: `
    SELECT * FROM permissions
    LIMIT $1 OFFSET $2
  `,
}
