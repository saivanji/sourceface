import * as moduleRepo from "repos/module"
import * as layoutRepo from "repos/layout"

// TODO: have updateModuleConfig mutation to make updates on a config to avoid
// concurrency issues(will need change front-end code accordingly and handle object
// setting, array filtering/appending on Postgres side)
// (moduleId: UUID!, key: String!, kind: 'set' | 'remove' | 'append', value: JSONObject!)

const createModule = async (
  parent,
  { moduleId, layoutId, position, type, name, config },
  { pg }
) =>
  pg.tx(async (t) => {
    await layoutRepo.insertPositions(layoutId, { [moduleId]: position }, t)

    return moduleRepo.create(moduleId, layoutId, type, name, config, t)
  })

const updateModule = async (parent, { moduleId, name, config }, { pg }) => {
  // TODO: perform validation of config input data depending on module type
  // also check on validationSchema whether it has "key" user tries to update
  // define specific module config types with scalars(bounded with validationSchemas)?

  const fields = {
    ...(name && { name }),
    ...(config && { config }),
  }

  return moduleRepo.update(moduleId, fields, pg)
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
