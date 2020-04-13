import path from "path"
import { QueryFile } from "pg-promise"

export const invitations = {
  byId: sql("invitations/byId.sql"),
  create: sql("invitations/create.sql"),
}

export const roles = {
  byUserId: sql("roles/byUserId.sql"),
  create: sql("roles/create.sql"),
  list: sql("roles/list.sql"),
}

export const users = {
  byId: sql("users/byId.sql"),
  byUsername: sql("users/byUsername.sql"),
  count: sql("users/count.sql"),
  changePassword: sql("users/changePassword.sql"),
  create: sql("users/create.sql"),
}

function sql(file) {
  const qf = new QueryFile(path.join(__dirname, file), { minify: true })
  if (qf.error) throw qf.error
  return qf
}
