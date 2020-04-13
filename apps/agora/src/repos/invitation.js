import { v4 as uuidv4 } from "uuid"
import moment from "moment"
import * as sql from "postgres/sql"

export const create = async ({ email, roleId }, pg) => {
  const id = uuidv4()
  const expires = moment().add(7, "days").toISOString()

  return await pg.one(sql.invitations.create, [id, email, expires, roleId])
}

export const byId = async (id, pg) => pg.one(sql.invitations.byId, [id])
