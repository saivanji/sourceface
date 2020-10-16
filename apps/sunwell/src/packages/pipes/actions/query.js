import React from "react"
import { Text, Value } from "../components"

// TODO: rename to `runQuery`

// TODO: when adding a new action, user will choose from multiple sub categories. For some modules will be the only one option(query, redirect),
// for others - many(module - for every module, from specific module)
//
// TODO: display primary and secondary(collapsible) information so user will not be overloaded by secondary information.
//
// TODO: have multiple kinds of tags.
// 1. Text input with optional autocomplete. (for query name, argument name)
// 2. Select. User may choose one option from suggested.
// 3. Value input. Allow to concatenate multiple inputs. User may enter:
// - Literal
// - Variable(from prev action result, input args, module value(not function call)). Every variable type will have it's unique color and icon

// TODO: probably don't need "+" action since it's only needed for arguments. Keep arguments under collapsed area(opened with small btn). It will be a list(can add new item with a button), on the left side of item will have argument name(as text, will suggest name), on the right side user can enter value.

// TODO: will have only one "module" action for now(for calling functions).
// "call `justify` `for`/`for every` `form_*`"

// TODO: get module value as variable

const data = {
  query_id: 4,
  args: [
    {
      type: "action",
      payload: {
        action_id: 7,
      },
    },
    {
      type: "key",
      payload: {
        name: "limit",
        value: {
          type: "plain",
          value: 5,
        },
      },
    },
    {
      type: "key",
      payload: {
        name: "offset",
        value: {
          type: "action",
          payload: {
            action_id: 4,
          },
        },
      },
    },
  ],
}

export function View({ data }) {
  return (
    <>
      <Text>Run</Text>
      <Value color="blue">listOrders</Value>
      <Text>with</Text>
      <Value color="gray">limit</Value>
      <Text>as</Text>
      <Value color="gray">5</Value>
      <Text>and</Text>
      <Value color="gray">offset</Value>
      <Text>as</Text>
      <Value color="gray">7</Value>
    </>
  )
}

export const execute = (data, { queries, modules }) => {}

// TODO: suggest next step depending what we already have in data
export const suggest = () => {}
