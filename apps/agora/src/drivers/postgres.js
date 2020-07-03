// use raw pg driver instead of pg promise?
import { mergeRight } from "ramda"
import pgPromise from "pg-promise"
import { evaluate } from "lib/runtime"

export const createState = config => ({ cn: pgp(config.connection) })

export const execute = async (config, args, state) => {
  config = mergeRight(defaultConfig, config)

  const result = await state.cn[results[config.result]](
    await evaluate(config.value, args)
  )

  const compute = await evaluate(config.compute)

  return compute(result)
}

const defaultConfig = {
  result: "many",
  compute: "a => a",
}

const pgp = pgPromise()

const results = {
  single: "oneOrNone",
  many: "manyOrNone",
}
