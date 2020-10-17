import React from "react"
import { Action, Value } from "../components"

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

const definition = {
  query_id: 4,
  args: [
    {
      type: "group",
      value: {
        type: "action",
        action_id: 7,
      },
    },
    {
      type: "key",
      key: "limit",
      value: {
        type: "literal",
        data: 5,
      },
    },
    {
      type: "key",
      key: "offset",
      value: {
        type: "local",
        name: "offset",
      },
    },
  ],
}

export function View({ definition }) {
  return (
    <Action>
      Execute
      <Value color="gray">listOrders</Value>
      query with
      <Action.Group>
        <Value color="gray">limit</Value>
        as
        <Value color="beige">5</Value>
      </Action.Group>
      and
      <Action.Group>
        <Value color="gray">offset</Value>
        as
        <Value color="beige">11</Value>
      </Action.Group>
    </Action>
  )
}

export const execute = (definition, { queries, modules }) => {}

export const suggest = (definition) => {}
