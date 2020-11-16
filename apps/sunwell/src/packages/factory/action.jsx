import React, { createContext, useContext } from "react"
import { path } from "ramda"
import { client } from "packages/client"
import { useContainer } from "./container"
import { useEditor } from "./editor"

const context = createContext({})

export function Action({ action, children }) {
  const { stock } = useContainer()
  const { configureAction, changeActionReference } = useEditor()

  const { Root, Cut } = stock.actions.dict[action.type]

  const props = {
    config: action.config,
    getReferenceData: (type, key) =>
      action[type + "s"].find(
        // TODO: handle the case when reference value is array
        (x) => x.id === action.config.references?.[type]?.[key]
      ),
    getReference: (type, key) => action.config.references?.[type]?.[key],
    listAll: (type, input) =>
      client
        .query(queries[type], input)
        .toPromise()
        .then(path(["data", type + "s"])),
    onReferenceChange: (type, key, data) =>
      changeActionReference(action.id, type, key, data),
    onConfigChange: (key, value) => configureAction(action.id, key, value),
  }

  const root = <Root {...props} />
  const cut = <Cut {...props} />

  return (
    <context.Provider value={{ action }}>
      {children(root, cut)}
    </context.Provider>
  )
}

export const useAction = () => {
  return useContext(context)
}

const queries = {
  command: `
    query($search: String, $limit: Int, $offset: Int) {
      commands(search: $search, limit: $limit, offset: $offset) {
        id
        name
        stale {
          id
        }
      }
    }
  `,
  page: `
    query($search: String, $limit: Int, $offset: Int) {
      pages(search: $search, limit: $limit, offset: $offset) {
        id
        title
        route
      }
    }
  `,
}
