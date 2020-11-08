import React from "react"
import { Static, Arguments } from "packages/toolkit"
import * as query from "packages/query"

// TODO: rename to "operation"

// TODO: when adding a new action, user will choose from multiple sub categories. For some modules will be the only one option(query, redirect),
// for others - many(module - for every module, from specific module)
//
// TODO: have multiple kinds of tags.
// 1. Text input with optional autocomplete. (for query name, argument name)
// 2. Select. User may choose one option from suggested.
// 3. Value input. Allow to concatenate multiple inputs. User may enter:
// - Literal
// - Variable(from prev action result(input), args, local value, external module value(not function call), page info). Every variable type will have it's unique color and icon

// TODO: will have only one "module" action for now(for calling functions).
// "call `justify` `for`/`for every` `form_*`"

// TODO: get module value as variable

// TODO: add "variable" action type(to be a replacement for Template) to get local or external module variable. support concatenation only there?

// TODO: have groupped autosuggest for all variables and have a switch only with literal?

// Single source of truth. That code might needs to be in "packages/factory/action.jsx"
// TODO: implement a hook which gets variable definition and returns it's data
// TODO: implement a hook which gets variable definition and returns it's title(for example module title needs display it's name)

// TODO: keep variables listing and getting variable value code in one place

// TODO: Implement "Selector" action so we can get object fields values. Might be useful for query results when we get an object like { count: 5 } and we need 5 as a result

export function Root({ queries, config: { queryId }, onConfigChange }) {
  const query = queryId && queries.find((x) => x.id === queryId)
  const suggestions = queries.map((q) => ({ title: q.name, value: q.id }))

  return (
    <>
      <span>Execute</span>
      <Static
        creationTitle="Add query"
        clearable={false}
        value={query?.id}
        onChange={(queryId) => onConfigChange("queryId", queryId)}
        suggestions={suggestions}
      />
      query
    </>
  )
}

export function Cut({
  config: { queryId, groups = [], fields = [] },
  onConfigChange,
}) {
  const changeFields = (fields) => onConfigChange("fields", fields)
  const changeGroups = (groups) => onConfigChange("groups", groups)

  return (
    queryId && (
      <Arguments
        groups={groups}
        fields={fields}
        onFieldsChange={changeFields}
        onGroupsChange={changeGroups}
      />
    )
  )
}

// TODO: have 2 functions:
// 1. Transforms action config to function arguments
// 2. Executes action, for that case it's equal to packages/query "execute"

export const serialize = (config, evaluate) => {
  const { queryId } = config

  const fields = config.fields?.reduce(
    (acc, { key, definition }) => ({ ...acc, [key]: evaluate(definition) }),
    {}
  )
  const groups = config.groups?.reduce(
    (acc, definition) => ({ ...acc, [definition.name]: evaluate(definition) }),
    {}
  )

  return [queryId, { ...fields, ...groups }]
}

export const execute = ({ queries }, { onReload }) => (queryId, args) => {
  const staleIds = queries.find((x) => x.id === queryId).stale.map((x) => x.id)

  return query.execute(queryId, args, staleIds, onReload)
}

export const readCache = () => query.readCache

export const add = (config) => {}

export const settings = {
  effect: true,
}
