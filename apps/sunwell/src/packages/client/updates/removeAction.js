import { parse } from "graphql"
import * as utils from "../utils"

export default (result, { actionId }, cache) => {
  const moduleId = utils.findModuleIdByAction(actionId, cache)
  const module = cache.readFragment(moduleFragment, { id: moduleId })

  const actions = module.actions.filter((a) => a.id !== actionId)

  cache.writeFragment(moduleFragment, {
    ...module,
    actions,
  })
}

const moduleFragment = parse(`
  fragment _ on Module {
    id
    actions {
      id
    }
  }
`)
