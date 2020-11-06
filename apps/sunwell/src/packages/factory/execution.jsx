import { useEffect } from "react"
import { useEditor } from "./editor"
import { useModule } from "./module"
import { useContainer } from "./container"
import { useVariables } from "./variables"

export const useFunction = () => {
  return [() => {}]
}

// TODO: have pipes as input in future
export const useValue = (pipe) => {
  const { stock } = useContainer()
  const { selectors } = useEditor()
  const { module } = useModule()
  const { evaluate } = useVariables(module.id)

  const actions = selectors.actions(pipe)
  const input = serialize(actions, stock, evaluate)

  useEffect(() => {
    console.log("execute", input)
  }, [JSON.stringify(input)])

  return [[[], [], [], []], false, false]
}

const serialize = (actions, stock, evaluate) =>
  actions.map(({ config, type }) => {
    const { serialize } = stock.actions.dict[type]
    return serialize(config, evaluate)
  })
