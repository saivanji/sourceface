import { prepare } from "./execution"
import { useLoad, useDependencies } from "./load"

export const useHandlers = (...fields) => {
  const dependencies = useDependencies()
  const [executions] = prepare(dependencies, fields)

  // TODO: consider function arguments as input to the action
  return executions?.map((fn) => fn && ((input) => fn(null, input))) || []
  // same as the above
  // return executions
}

export const useValues = (...fields) => {
  const dependencies = useDependencies()

  return useLoad(...prepare(dependencies, fields))
}
