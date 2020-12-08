import * as actionRepo from "repos/action"

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

const pagesRefs = async (parent, args, ctx) =>
  ctx.loaders.pagesReferencesByAction.load(parent.id)

const operationsRefs = async (parent, args, ctx) =>
  ctx.loaders.operationsReferencesByAction.load(parent.id)

const modulesRefs = async (parent, args, ctx) =>
  ctx.loaders.modulesReferencesByAction.load(parent.id)

export default {
  Mutation: {
    createAction,
    updateAction,
    removeAction,
  },
  Action: {
    pagesRefs,
    operationsRefs,
    modulesRefs,
  },
}
