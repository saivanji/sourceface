import * as moduleRepo from "repos/module"

const createModule = async (parent, { type, config, position }, { pg }) => {
  return await moduleRepo.create(type, config, position, pg)
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

// const updateModulesPositions = async (parent, { positions }, { pg }) => {
//   return await pg.tx(async t => {
//     return await Promise.all(
//       positions.map(
//         async ({ id, ...position }) =>
//           await moduleRepo.updatePosition(id, position, t)
//       )
//     )
//   })
// }

export default {
  Mutation: {
    createModule,
    updateModule,
    // updateModulesPositions,
  },
}
