import * as moduleRepo from "repos/module"

const createModule = async (
  parent,
  { moduleId, parentId, pageId, type, name, config, position },
  { pg }
) =>
  moduleRepo.create(
    moduleId,
    parentId,
    pageId,
    type,
    name,
    config,
    position,
    pg
  )

const updateModule = async (parent, { moduleId, ...fields }, { pg }) => {
  // TODO: perform validation of config input data depending on module type
  // also check on validationSchema whether it has "key" user tries to update
  // define specific module config types with scalars(bounded with validationSchemas)?

  return moduleRepo.update(moduleId, fields, pg)
}

const updateModules = async (parent, { modules }, { pg }) => {
  return moduleRepo.updateMany(
    modules.map(({ moduleId, ...rest }) => ({ id: moduleId, ...rest })),
    pg
  )
}

const removeModule = async (parent, { moduleId }, { pg }) => {
  await moduleRepo.remove(moduleId, pg)

  return true
}

const actions = (parent, args, ctx) =>
  ctx.loaders.actionsByModule.load(parent.id)

export default {
  Mutation: {
    createModule,
    updateModule,
    updateModules,
    removeModule,
  },
  Module: {
    actions,
  },
}
