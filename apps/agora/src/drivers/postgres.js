// use raw pg driver instead of pg promise?
import * as R from "ramda"
import pgPromise from "pg-promise"
import { exec } from "lib/runtime"

export const createState = config => ({ cn: pgp(config.connection) })

export const execute = (
  config = R.mergeRight(defaultConfig, config),
  args,
  state
) => state.cn[results[config.result]](exec(config.value, args))

const defaultConfig = {
  result: "many",
}

const pgp = pgPromise()

const results = {
  single: "oneOrNone",
  many: "manyOrNone",
}
