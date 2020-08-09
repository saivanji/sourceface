import * as moduleRepo from "repos/module"
import * as positionRepo from "repos/position"

const createModule = async (
  parent,
  { type, config, position: { layoutId, ...position } },
  { pg }
) => {
  return pg.tx(async t => {
    const positionOut = await positionRepo.create(layoutId, position, t)
    const module = await moduleRepo.create(type, config, positionOut.id, t)

    return {
      ...module,
      position: positionOut,
    }
  })
}

const updateModule = async (parent, { moduleId, key, value }, { pg }) => {
  return await pg.task(async t => {
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
  /**
   * Since module is 1:1 polymorphic relation with position, along with
   * deleting module, it's position needs to be removed as well.
   * Therefore position is deleted at the first point instead of module
   * which will be deleted automatically because of a foreign key.
   */
  await positionRepo.removeByModule(moduleId, pg)
  return true
}

const position = (parent, args, ctx) =>
  ctx.loaders.position.load(parent.positionId)

export default {
  Mutation: {
    createModule,
    updateModule,
    removeModule,
  },
  Module: {
    position,
  },
}
