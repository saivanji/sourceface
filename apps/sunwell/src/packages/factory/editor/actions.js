import { v4 as uuid } from "uuid"
import { useContainer } from "../container"
import * as utils from "./utils"

export function useActions(state, initialState, dispatch) {
  const { stock } = useContainer()

  function select(moduleId) {
    dispatch({ type: "select", payload: moduleId })
  }

  function edit(isEditing) {
    dispatch({ type: "edit", payload: isEditing })
    if (!isEditing) {
      dispatch({ type: "reset", payload: initialState })
    }
  }

  function updateLayout(layoutId, positions) {
    dispatch({
      type: "updateLayout",
      payload: {
        layoutId,
        positions,
      },
    })
  }

  function createModule(layoutId, type, position) {
    const moduleId = uuid()
    dispatch({
      type: "createModule",
      payload: {
        layoutId,
        moduleId,
        config: stock.modules.dict[type].defaultConfig,
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

  function removeModule(moduleId) {
    const layoutId = utils.findLayoutIdByModule(
      moduleId,
      state.entities.layouts
    )
    dispatch({
      type: "removeModule",
      payload: { moduleId, layoutId },
    })
  }

  function createAction(moduleId, type) {
    const actionId = uuid()
    dispatch({
      type: "createAction",
      payload: { actionId, moduleId, type, config: {} },
    })
    return actionId
  }

  function configureAction(actionId, key, value) {
    dispatch({
      type: "configureAction",
      payload: { actionId, key, value },
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
    edit,
    select,
    updateLayout,
    createModule,
    configureModule,
    renameModule,
    removeModule,
    createAction,
    configureAction,
    renameAction,
    removeAction,
  }
}
