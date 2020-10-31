import { v4 as uuid } from "uuid"
import { useMutation, mutations } from "packages/client"
import { useConfiguration } from "../../configuration"

export const useCreateAction = (onCreateSuccess) => {
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
    onCreateSuccess(action)
  }
}
