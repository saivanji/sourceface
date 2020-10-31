import { v4 as uuid } from "uuid"
import { useMutation, mutations } from "packages/client"
import { useConfiguration } from "../../configuration"

export const useCreateAction = (onSuccess) => {
  const { module } = useConfiguration()
  const [, createAction] = useMutation(mutations.createAction)

  return async (type) => {
    const {
      data: { createAction: action },
    } = await createAction({
      actionId: uuid(),
      moduleId: module.id,
      type,
      config: {},
    })

    // TODO: should call "onChange" in onSuccess mutation callback in order to execute after optimistic update
    // will apply and not after server request will be received.
    onSuccess(action)
  }
}

export const useRemoveAction = (onSuccess) => {
  const [, removeAction] = useMutation(mutations.removeAction)

  return async (actionId) => {
    await removeAction({ actionId })
    onSuccess(actionId)
  }
}

export const useConfigureAction = () => {
  const [, changeActionConfig] = useMutation(mutations.changeActionConfig)

  return (actionId, key, value) => changeActionConfig({ actionId, key, value })
}
