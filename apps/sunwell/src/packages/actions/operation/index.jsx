import React from "react"
import { map } from "ramda"
import { Static, Arguments } from "packages/toolkit"
import request, { cache } from "./request"

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
// alternative - "for every "
// - depending on how much modules selected
//   - singular - "for `input_1` module call `justify`"
//   - plural - "for every in `3 modules` call `justify`"

// TODO: get module value as variable

// TODO: add "variable" action type(to be a replacement for Template) to get local or external module variable. support concatenation only there?

// TODO: have groupped autosuggest for all variables and have a switch only with literal?

// Single source of truth. That code might needs to be in "packages/factory/action.jsx"
// TODO: implement a hook which gets variable definition and returns it's data
// TODO: implement a hook which gets variable definition and returns it's title(for example module title needs display it's name)

// TODO: keep variables listing and getting variable value code in one place

// TODO: Implement "Selector" action so we can get object fields values. Might be useful for query results when we get an object like { count: 5 } and we need 5 as a result

// TODO: UI improvements
// 1. If cut has no data populated - do not display bottom bar. Display only "down" icon.
// 2. If action has no name - hide input. Display trigger in the right side remove icon.
// 3. Keep field name inside of action bar. Rethink empty state. Fit action creation inside of action bar.
// 4. Consider not collapsing actions, since it might be not much of them

export function Root({ commands }) {
  const KEY = "queryId"
  const command = commands.getLocal(KEY)

  const suggestions = (search, page) =>
    commands
      .fetchAll({ search, limit: 10, offset: page * 10 })
      .then(map((c) => ({ title: c.name, value: c.id })))

  return (
    <>
      <span>Execute</span>
      <Static
        creationTitle="Add query"
        editionTitle={command?.name}
        clearable={false}
        value={command?.id}
        onChange={(queryId) => commands.change(KEY, "value")}
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

  return request(queryId, args, staleIds, onReload)
}

export const readCache = () => cache.get.bind(cache)

export const add = (config) => {}

export const settings = {
  effect: true,
}
