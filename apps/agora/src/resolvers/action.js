import * as actionRepo from "repos/action"
import * as referenceUtils from "utils/reference"

const createAction = async (
  parent,
  { actionId, moduleId, order, field, type, name, config },
  { pg }
) =>
  await actionRepo.create(
    actionId,
    moduleId,
    order,
    field,
    type,
    name,
    config,
    pg
  )

const updateAction = (parent, { actionId, ...fields }, { pg }) => {
  return actionRepo.update(actionId, fields, pg)
}

const removeAction = async (parent, { actionId }, { pg }) => {
  await actionRepo.remove(actionId, pg)
  return true
}

const references = async (parent, args, ctx) =>
  referenceUtils.transform(await ctx.loaders.referencesByAction.load(parent.id))

export default {
  Mutation: {
    createAction,
    updateAction,
    removeAction,
  },
  Action: {
    references,
  },
}
