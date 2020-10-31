import { v4 as uuid } from "uuid"
import { useMutation, mutations } from "packages/client"
import { useConfiguration } from "../../configuration"

export const useCreateAction = (name, value, onSuccess, onFailure) => {
  const { module } = useConfiguration()
  const [, createAction] = useMutation(mutations.createAction)

  return async (type) => {
    const actionId = uuid()

    try {
      /**
       * Optimistically calling onSuccess.
       */
      onSuccess()
      await createAction({
        actionId,
        moduleId: module.id,
        type,
        config: {},
        key: name,
        value: [...value, actionId],
      })
    } catch (err) {
      /**
       * Reverting optimistic UI change in case of failed mutation.
       */
      onFailure()
    }
  }
}

export const useRemoveAction = (name, value) => {
  const { module } = useConfiguration()
  const [, removeAction] = useMutation(mutations.removeAction)

  return (actionId) =>
    removeAction({
      actionId,
      moduleId: module.id,
      key: name,
      value: value.filter((x) => x.id !== actionId),
    })
}

export const useConfigureAction = () => {
  const [, changeActionConfig] = useMutation(mutations.changeActionConfig)

  return (actionId, key, value) => changeActionConfig({ actionId, key, value })
}
