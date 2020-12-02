import React, { createContext, useContext } from "react"
import { keys, path } from "ramda"
import { client } from "packages/client"
import { useContainer } from "./container"
import { useEditor } from "./editor"

const context = createContext({})

export function Action({ action, children }) {
  const { stock } = useContainer()
  const { configureAction, changeRelation } = useEditor()

  const { Root, Cut } = stock.actions.dict[action.type]

  const props = {
    id: action.id,
    config: action.config,
    listAll,
    relations: populateRelations(action, changeRelation),
    onRelationChange: (type, key, data) =>
      changeRelation(action.id, type, key, data),
    onConfigChange: (key, value) => configureAction(action.id, key, value),
  }

  const root = <Root {...props} />
  const cut = Cut && <Cut {...props} />

  return (
    <context.Provider value={props}>{children(root, cut)}</context.Provider>
  )
}

export const useAction = () => {
  return useContext(context)
}

export const populateRelations = (action) =>
  keys(action.relations).reduce(
    (acc, type) => ({
      ...acc,
      [type]: keys(action.relations[type]).reduce((acc, key) => {
        const plain = action.relations[type][key]
        const find = (id) => action[type].find((x) => x.id === id)

        return {
          ...acc,
          [key]: plain instanceof Array ? plain.map(find) : find(plain),
        }
      }, {}),
    }),
    {}
  )

const listAll = (type, input) =>
  client
    .query(queries[type], input)
    .toPromise()
    .then(path(["data", type]))

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
