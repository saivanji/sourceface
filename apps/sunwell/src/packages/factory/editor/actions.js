import { v4 as uuid } from "uuid"
import { useContainer } from "../container"
import * as utils from "./utils"

// TODO: export plain action creators and pass down "dispatch" function to the context?
export function useActions(state, dispatch) {
  const { stock } = useContainer()

  function select(moduleId) {
    dispatch({ type: "select", payload: moduleId })
  }

  function reset(page) {
    dispatch({ type: "reset", payload: page })
  }

  function edit(isEditing) {
    dispatch({ type: "edit", payload: isEditing })
  }

  function createModule(parentId, type, position) {
    const moduleId = uuid()
    dispatch({
      type: "createModule",
      payload: {
        moduleId,
        parentId,
        config: stock.modules.dict[type].defaults,
        type,
        name,
        position,
      },
    })
    return moduleId
  }

  function configureModule(moduleId, key, value) {
    dispatch({
      type: "configureModule",
      payload: {
        moduleId,
        key,
        value,
      },
    })
  }

  function renameModule(moduleId, name) {
    dispatch({
      type: "renameModule",
      payload: { moduleId, name },
    })
  }

  function updateModules(data) {
    dispatch({
      type: "updateModules",
      payload: data,
    })
  }

  function removeModule(moduleId) {
    dispatch({
      type: "removeModule",
      payload: { moduleId },
    })
  }

  function createAction(moduleId, field, type) {
    const actionId = uuid()
    dispatch({
      type: "createAction",
      payload: { actionId, moduleId, field, type, config: {} },
    })
    return actionId
  }

  function configureAction(actionId, key, value) {
    dispatch({
      type: "configureAction",
      payload: { actionId, key, value },
    })
  }

  function changeReference(actionId, type, field, data) {
    dispatch({
      type: "changeReference",
      payload: { actionId, type, field, data },
    })
  }

  function renameAction(actionId, name) {
    dispatch({
      type: "renameAction",
      payload: { actionId, name },
    })
  }

  function removeAction(actionId) {
    const moduleId = utils.findModuleIdByAction(
      actionId,
      state.entities.modules
    )
    dispatch({
      type: "removeAction",
      payload: { actionId, moduleId },
    })
  }

  return {
    select,
    reset,
    edit,
    createModule,
    configureModule,
    renameModule,
    updateModules,
    removeModule,
    createAction,
    configureAction,
    changeReference,
    renameAction,
    removeAction,
  }
}
