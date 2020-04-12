import * as sql from "postgres/sql"

export const create = (name, pg) => pg.one(sql.roles.create, [name])

export const list = (ids, pg) => pg.manyOrNone(sql.roles.list, [ids])
