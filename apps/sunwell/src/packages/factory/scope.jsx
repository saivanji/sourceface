import { mergeRight } from "ramda"
import { prepare } from "./execution"
import { useLoad, useDependencies } from "./load"

export const useScope = (...names) => {
  const dependencies = useDependencies()
  const blueprint = dependencies.stock.modules.dict[dependencies.module.type]
  const state = mergeRight(
    blueprint.initialState,
    dependencies.store.state[dependencies.module.id]
  )

  let id = ""

  const result = names.map((name) => {
    const [funcs, cache, identifier] = prepare(
      dependencies,
      blueprint.dependencies.scope[name]
    )

    id += identifier

    return [funcs, cache, blueprint.scope[name]]
  })

  const cached = result.every(([, cache]) => !!cache)

  const funcs = result.map(([funcs, , selector]) => async () =>
    selector(...(await Promise.all(funcs.map((fn) => fn()))), state)
  )
  const cache =
    cached && result.map(([, cache, selector]) => selector(...cache, state))

  return useLoad(funcs, cache, id)
}
