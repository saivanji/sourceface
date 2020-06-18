import pgPromise from "pg-promise"

const pgp = pgPromise()

export const connect = connection => pgp(connection)

export const execute = (query, cn) => cn.manyOrNone(query.value)
