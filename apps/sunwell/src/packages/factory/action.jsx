import React, { createContext, useContext } from "react"
import { path } from "ramda"
import { client } from "packages/client"
import { useContainer } from "./container"
import { useEditor } from "./editor"

const context = createContext({})

export function Action({ action, children }) {
  const { stock } = useContainer()
  const { configureAction } = useEditor()

  const { Root, Cut } = stock.actions.dict[action.type]

  const configureSelf = (key, value) => configureAction(action.id, key, value)

  const props = {
    config: action.config,
    pages: createRelation("pages", action, configureSelf),
    commands: createRelation("commands", action, configureSelf),
    onConfigChange: configureSelf,
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

const createRelation = (name, action, onConfigChange) => ({
  getLocal: (key) => action[name].find((x) => x.id === action.config[key]),
  fetchAll: (input) =>
    client
      .query(queries[name], input)
      .toPromise()
      .then(path(["data", name])),
  change: (key, id) => {
    // TODO: assoc/dissoc. dispatch action to editor
    onConfigChange(key, id)
  },
})

const queries = {
  commands: `
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
  pages: `
    query($search: String, $limit: Int, $offset: Int) {
      pages(search: $search, limit: $limit, offset: $offset) {
        id
        title
        route
      }
    }
  `,
}
