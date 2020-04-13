import path from "path"
import { QueryFile } from "pg-promise"

export const roles = {
  create: sql("roles/create.sql"),
  list: sql("roles/list.sql"),
  privileged: sql("roles/privileged.sql"),
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
