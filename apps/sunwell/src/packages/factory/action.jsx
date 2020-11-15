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

  const props = {
    fetchPages,
    fetchCommands,
    config: action.config,
    pages: action.pages,
    commands: action.commands,
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

const fetchCommands = (input) =>
  client
    .query(queries.commands, input)
    .toPromise()
    .then(path(["data", "commands"]))

const fetchPages = (input) =>
  client
    .query(queries.pages, input)
    .toPromise()
    .then(path(["data", "pages"]))

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
