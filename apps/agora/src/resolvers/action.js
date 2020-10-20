import * as actionRepo from "repos/action"

const createAction = async (parent, { moduleId, type, config }, { pg }) =>
  await actionRepo.create(moduleId, type, config, pg)

const renameAction = async (parent, { actionId, name }, { pg }) =>
  await actionRepo.rename(actionId, name, pg)

const alterActionConfig = async (parent, { actionId, key, value }, { pg }) => {
  const action = await actionRepo.one(actionId, pg)

  return await actionRepo.updateConfig(actionId, {
    ...action.config,
    [key]: value,
  })
}

export default {
  Mutation: {
    createAction,
    renameAction,
    alterActionConfig,
  },
}
