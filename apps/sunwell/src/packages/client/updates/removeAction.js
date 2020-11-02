import * as utils from "../utils"

// TODO: implement
export default (result, { actionId }, cache) => {
  console.log(utils.findModuleIdByAction(actionId, cache))
}
