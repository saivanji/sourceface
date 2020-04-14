import { v4 as uuidv4 } from "uuid"
import moment from "moment"

export const create = async ({ email, roleId }, pg) => {
  const id = uuidv4()
  const expires = moment().add(7, "days").toISOString()

  return await pg.one(sql.create, [id, email, expires, roleId])
}

export const byId = async (id, pg) => pg.one(sql.byId, [id])

const sql = {
  create: `
    INSERT INTO invitations (id, email, expires_at, role_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `,
  byId: `
    SELECT * FROM invitations
    WHERE id = $1
  `,
}
