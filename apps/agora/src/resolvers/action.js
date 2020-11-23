import * as actionRepo from "repos/action"

const createAction = async (
  parent,
  { actionId, moduleId, type, name, config, relations },
  { pg }
) =>
  await actionRepo.create(actionId, moduleId, type, name, config, relations, pg)

const updateAction = (
  parent,
  { actionId, name, config, relations },
  { pg }
) => {
  const fields = {
    ...(name && { name }),
    ...(config && { config }),
    ...(relations && {
      relations,
    }),
  }

  return actionRepo.update(actionId, fields, pg)
}

const removeAction = async (parent, { actionId }, { pg }) => {
  await actionRepo.remove(actionId, pg)
  return true
}

const pages = (parent, args, ctx) =>
  ctx.loaders.pagesByRelations.load(parent.relations)

const commands = (parent, args, ctx) =>
  ctx.loaders.commandsByRelations.load(parent.relations)

export default {
  Mutation: {
    createAction,
    updateAction,
    removeAction,
  },
  Action: {
    pages,
    commands,
  },
}
