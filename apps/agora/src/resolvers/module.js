import * as moduleRepo from "repos/module"
import * as layoutRepo from "repos/layout"

const createModule = async (
  parent,
  { moduleId, layoutId, type, name, config, position },
  { pg }
) => {
  return pg.tx(async (t) => {
    const { positions } = await layoutRepo.one(layoutId, t)

    await layoutRepo.updatePositions(
      layoutId,
      {
        ...positions,
        [moduleId]: position,
      },
      t
    )

    return await moduleRepo.create(moduleId, type, name, config, t)
  })
}

const configureModule = async (parent, { moduleId, key, value }, { pg }) => {
  return await pg.task(async (t) => {
    const module = await moduleRepo.one(moduleId, t)

    // TODO: perform validation of config input data depending on module type
    // also check on validationSchema whether it has "key" user tries to update
    // define specific module config types with scalars(bounded with validationSchemas)?

    return await moduleRepo.updateConfig(
      moduleId,
      { ...module.config, [key]: value },
      t
    )
  })
}

const removeModule = async (parent, { moduleId }, { pg }) => {
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
    configureModule,
    removeModule,
  },
  Module: {
    actions,
    layouts,
  },
}
