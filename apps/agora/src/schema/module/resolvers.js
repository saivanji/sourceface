import * as moduleRepo from "repos/module"

const modules = async (parent, args, { pg }) => {
  return await moduleRepo.all(pg)
}

const updateModule = async (parent, { moduleId, key, value }, { pg }) => {
  return await pg.task(async t => {
    const module = await moduleRepo.one(moduleId, t)

    // TODO: perform validation of config input data depending on module type
    // also check on validationSchema whether it has "key" user tries to update

    return await moduleRepo.updateConfig(
      moduleId,
      { ...module.config, [key]: value },
      t
    )
  })
}

export default {
  Query: {
    modules,
  },
  Mutation: {
    updateModule,
  },
}
