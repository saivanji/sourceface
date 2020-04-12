import path from "path"
import { QueryFile } from "pg-promise"

export const users = {
  create: sql("users/create.sql"),
  byId: sql("users/byId.sql"),
  byUsername: sql("users/byUsername.sql"),
}

function sql(file) {
  const qf = new QueryFile(path.join(__dirname, file), { minify: true })
  if (qf.error) throw qf.error
  return qf
}
