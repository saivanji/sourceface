import { mergeRight } from "ramda"
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

const updateAction = (parent, { actionId, name, config }, { pg }) =>
  pg.tx(async (t) => {
    const prev = await actionRepo.one(actionId, t)
    const fields = {
      ...(name && { name }),
      ...(config && { config: mergeRight(prev.config, config) }),
    }

    return name || config ? await actionRepo.update(actionId, fields, t) : prev
  })

const pages = (parent, args, ctx) =>
  ctx.loaders.pagesByActionConfig.load(parent.config)

const commands = (parent, args, ctx) =>
  ctx.loaders.commandsByActionConfig.load(parent.config)

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
