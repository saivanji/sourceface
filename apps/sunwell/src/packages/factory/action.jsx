import React, { createContext, useContext } from "react"
import { path } from "ramda"
import { client } from "packages/client"
import { useContainer } from "./container"
import { useEditor } from "./editor"

const context = createContext({})

export function Action({ action, children }) {
  const { stock } = useContainer()
  const { configureAction, changeActionPage, changeActionCommand } = useEditor()

  const { Root, Cut } = stock.actions.dict[action.type]

  const configureSelf = (key, value) => configureAction(action.id, key, value)

  const props = {
    config: action.config,
    pages: createRelation("pages", action, changeActionPage),
    commands: createRelation("commands", action, changeActionCommand),
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

const createRelation = (name, action, change) => ({
  getLocal: (key) => action[name].find((x) => x.id === action.config[key]),
  fetchAll: (input) =>
    client
      .query(queries[name], input)
      .toPromise()
      .then(path(["data", name])),
  change: (key, value) => change(action.id, key, value),
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
