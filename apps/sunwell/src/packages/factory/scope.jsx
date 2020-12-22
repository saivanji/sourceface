import { prepare } from "./execution"
import { useLoad, useDependencies } from "./load"

export const useScope = (...names) => {
  const dependencies = useDependencies()
  const state = dependencies.store.state[dependencies.module.id]
  const blueprint = dependencies.stock.modules.dict[dependencies.module.type]

  const result = names.map((name) => {
    const [funcs, cache] = prepare(
      dependencies,
      blueprint.dependencies.scope[name]
    )

    return [funcs, cache, blueprint.scope[name]]
  })

  const cached = result.all(([, cache]) => !!cache)

  const funcs = result.map(([funcs, , selector]) => async () =>
    selector(...(await Promise.all(funcs)), state)
  )
  const cache =
    cached && result.map(([, cache, selector]) => selector(...cache, state))

  return useLoad([funcs, cache])
}
