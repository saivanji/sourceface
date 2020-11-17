import { mergeRight, mergeDeepRight } from "ramda"
import * as actionRepo from "repos/action"

const createAction = async (
  parent,
  { actionId, moduleId, type, config },
  { pg }
) => await actionRepo.create(actionId, moduleId, type, config, pg)

const removeAction = async (parent, { actionId }, { pg }) => {
  await actionRepo.remove(actionId, pg)
  return true
}

const updateAction = (parent, { actionId, name, config, relations }, { pg }) =>
  pg.tx(async (t) => {
    const prev = await actionRepo.one(actionId, t)
    const fields = {
      ...(name && { name }),
      ...(config && { config: mergeRight(prev.config, config) }),
      ...(relations && {
        relations: mergeDeepRight(prev.relations, relations),
      }),
    }

    return name || config || relations
      ? await actionRepo.update(actionId, fields, t)
      : prev
  })

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
