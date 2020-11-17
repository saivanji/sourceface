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

const updateAction = (parent, { actionId, name, config, references }, { pg }) =>
  pg.tx(async (t) => {
    const prev = await actionRepo.one(actionId, t)
    const fields = {
      ...(name && { name }),
      ...(config && { config: mergeRight(prev.config, config) }),
      ...(references && {
        references: mergeDeepRight(prev.references, references),
      }),
    }

    return name || config || references
      ? await actionRepo.update(actionId, fields, t)
      : prev
  })

const pages = (parent, args, ctx) =>
  ctx.loaders.pagesByReferences.load(parent.references)

const commands = (parent, args, ctx) =>
  ctx.loaders.commandsByReferences.load(parent.references)

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
