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

const references = async (parent, args, ctx) => {
  const [pages, operations, modules] = await Promise.all([
    ctx.loaders.pagesReferencesByAction.load(parent.id),
    ctx.loaders.operationsReferencesByAction.load(parent.id),
    ctx.loaders.modulesReferencesByAction.load(parent.id),
  ])

  return {
    pages,
    operations,
    modules,
  }
}

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
