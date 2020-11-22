import { mergeRight } from "ramda"
import * as moduleRepo from "repos/module"
import * as layoutRepo from "repos/layout"

const createModule = async (
  parent,
  { moduleId, layoutId, position, type, name, config },
  { pg }
) =>
  pg.tx(async (t) => {
    await layoutRepo.insertPositions(layoutId, { [moduleId]: position }, t)

    return moduleRepo.create(moduleId, layoutId, type, name, config, t)
  })

// TODO: probably do not merge JSON data in JS due to concurrency issues
const updateModule = async (parent, { moduleId, name, config }, { pg }) => {
  return await pg.task(async (t) => {
    const prev = await moduleRepo.one(moduleId, t)
    const fields = {
      ...(name && { name }),
      ...(config && { config: mergeRight(prev.config, config) }),
    }

    // TODO: perform validation of config input data depending on module type
    // also check on validationSchema whether it has "key" user tries to update
    // define specific module config types with scalars(bounded with validationSchemas)?

    return name || config ? await moduleRepo.update(moduleId, fields, t) : prev
  })
}

const removeModule = async (parent, { moduleId }, { pg }) => {
  // TODO: remove module from the assigned layout.(get layout_id from delete statement)

  await moduleRepo.remove(moduleId, pg)

  return true
}

const actions = (parent, args, ctx) =>
  ctx.loaders.actionsByModule.load(parent.id)

const layouts = (parent, args, ctx) =>
  ctx.loaders.layoutsByModule.load(parent.id)

export default {
  Mutation: {
    createModule,
    updateModule,
    removeModule,
  },
  Module: {
    actions,
    layouts,
  },
}
