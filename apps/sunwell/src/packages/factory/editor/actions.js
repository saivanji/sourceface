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

  function changeRelation(actionId, type, key, data) {
    dispatch({
      type: "changeRelation",
      payload: { actionId, type, key, data },
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
    updateLayout,
    createModule,
    configureModule,
    renameModule,
    removeModule,
    createAction,
    configureAction,
    changeRelation,
    renameAction,
    removeAction,
  }
}
