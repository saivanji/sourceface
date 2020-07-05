// Have it as sql driver instead and user will choose specific dialects?
//
// use raw pg driver instead of pg promise?
import { mergeRight } from "ramda"
import pgPromise from "pg-promise"
import * as engine from "lib/engine"
import * as js from "lib/runtime"

export const createState = config => ({ cn: pgp(config.connection) })

export const execute = async (config, args, state) => {
  config = mergeRight(defaultConfig, config)

  const result = await state.cn[results[config.result]](
    engine.render(config.value, { constants: args })
  )

  // TODO: deprecate. use engine instead
  const compute = await js.evaluate(config.compute)

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
