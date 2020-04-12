import path from "path"
import { QueryFile } from "pg-promise"

export const users = {
  byId: sql("users/byId.sql"),
  byUsername: sql("users/byUsername.sql"),
  countAll: sql("users/countAll.sql"),
  changePassword: sql("users/changePassword.sql"),
  create: sql("users/create.sql"),
}

function sql(file) {
  const qf = new QueryFile(path.join(__dirname, file), { minify: true })
  if (qf.error) throw qf.error
  return qf
}
