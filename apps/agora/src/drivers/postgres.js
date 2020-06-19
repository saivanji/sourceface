// use raw pg driver instead of pg promise?
import pgPromise from "pg-promise"

const pgp = pgPromise()

export const escape = value => value

export const connect = connection => pgp(connection)

export const execute = (query, cn) => cn.manyOrNone(query)
