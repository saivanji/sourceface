import { keys } from "ramda"
import graphqlFields from "graphql-fields"
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

const position = (parent, args, ctx, info) => {
  const fields = keys(graphqlFields(info)).filter(k => k !== "__typename")
  const id = parent.positionId

  if (fields.length === 1 && fields.includes("id")) {
    return {
      id,
    }
  }

  return ctx.loaders.position.load(id)
}

export default {
  Mutation: {
    createModule,
    updateModule,
  },
  Module: {
    position,
  },
}
