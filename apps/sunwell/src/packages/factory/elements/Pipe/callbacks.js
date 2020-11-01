import { v4 as uuid } from "uuid"
import { useMutation, mutations } from "packages/client"
import { useConfiguration } from "../../configuration"

export const useCreateAction = (onSuccess, onFailure) => {
  const { module } = useConfiguration()
  const [, createAction] = useMutation(mutations.createAction)

  return async (type) => {
    const actionId = uuid()

    try {
      await Promise.all([
        onSuccess(actionId),
        createAction({
          actionId,
          moduleId: module.id,
          type,
          config: {},
        }),
      ])
    } catch (err) {
      /**
       * Reverting optimistic UI change in case of failed mutation.
       */
      onFailure()
    }
  }
}

export const useRemoveAction = (onSuccess) => {
  const [, removeAction] = useMutation(mutations.removeAction)

  return (actionId) =>
    Promise.all([
      onSuccess(actionId),
      removeAction({
        actionId,
      }),
    ])
}

export const useConfigureAction = () => {
  const [, changeActionConfig] = useMutation(mutations.changeActionConfig)

  return (actionId, key, value) => changeActionConfig({ actionId, key, value })
}
