import * as actionRepo from "repos/action"

const createAction = async (
  parent,
  { actionId, moduleId, type, config },
  { pg }
) => await actionRepo.create(actionId, moduleId, type, config, pg)

const renameAction = async (parent, { actionId, name }, { pg }) =>
  await actionRepo.rename(actionId, name, pg)

const removeAction = async (parent, { actionId }, { pg }) => {
  await actionRepo.remove(actionId, pg)
  return true
}

const changeActionConfig = async (parent, { actionId, key, value }, { pg }) => {
  return await pg.task(async (t) => {
    const action = await actionRepo.one(actionId, t)

    return await actionRepo.updateConfig(
      actionId,
      {
        ...action.config,
        [key]: value,
      },
      t
    )
  })
}

export default {
  Mutation: {
    createAction,
    renameAction,
    removeAction,
    changeActionConfig,
  },
}
