import React from "react"
import { mapObjIndexed } from "ramda"
import { Reference, Arguments } from "packages/toolkit"
import { getReference } from "packages/factory"
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

// TODO: have "dictionary" module type and have arguments like key/value definition

// TODO: will have only one "module"(function) action for now(for calling functions of any variable not module specifically).
// "call `justify` `for`/`for every` `form_*`"
// alternative - "for every "
// - depending on how much modules selected
//   - singular - "for `input_1` module call `justify`"(autosuggest)
//   - plural - "for every in `3 modules`(or display tag stack?) call `justify`"(autosuggest)
// NO in case of multiple result - have option for mapping field keys under the cut
// display arguments section under the cut
//
// When no module selected - display all available variables.
// When at least one module is selected - display only modules which have common function to call

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

// TODO: in case variable is an object, neither of it's fields can be accessed via dropdown. Have separate action for accessing object variable fields

const FIELD = "current"
const REFERENCE_TYPE = "operations"

export function Root() {
  return (
    <>
      <span>Execute</span>
      <Reference
        type={REFERENCE_TYPE}
        field={FIELD}
        titleKey="name"
        creationTitle="Add operation"
      />
      query
    </>
  )
}

export function Cut({ action, onConfigChange }) {
  const { groups = [], fields = [] } = action.config
  const operation = getReference(REFERENCE_TYPE, FIELD, action)
  // TODO: set only config fields for Arguments and not provide handlers?
  const changeFields = (fields) => onConfigChange("fields", fields)
  const changeGroups = (groups) => onConfigChange("groups", groups)

  return (
    operation && (
      <Arguments
        groups={groups}
        fields={fields}
        onFieldsChange={changeFields}
        onGroupsChange={changeGroups}
      />
    )
  )
}

// TODO: name it differently, since it's not required to return serializable object(variable.get for example)
export const serialize = (config, action, { createVariable }) => {
  const operation = getReference(REFERENCE_TYPE, FIELD, action)
  const staleIds = operation?.stale.map((x) => x.id)

  const fields = config.fields?.reduce(
    (acc, { key, definition }) => ({
      ...acc,
      [key]: createVariable(definition),
    }),
    {}
  )
  const groups = config.groups?.map(createVariable)

  return [operation?.id, fields, groups, staleIds]
}

export const execute = ({ runtime, onReload }) => (
  operationId,
  fields,
  groups,
  staleIds
) => {
  return request(
    operationId,
    createArgs(runtime, fields, groups),
    staleIds,
    onReload
  )
}

export const readCache = ({ runtime }) => (operationId, fields, groups) =>
  cache.get(operationId, createArgs(runtime, fields, groups))

export const add = (config) => {}

export const settings = {
  effect: true,
}

const createArgs = (runtime, fields, groups) => ({
  ...mapObjIndexed((variable) => variable.get(runtime), fields),
  ...groups?.reduce(
    (acc, variable) => ({ ...acc, ...variable.get(runtime) }),
    {}
  ),
})
