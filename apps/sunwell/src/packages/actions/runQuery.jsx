import React from "react"
import { Action, Static, Arguments } from "./components"

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

export function View({ config }) {
  // TODO: get queries from context

  return (
    <Action secondary={<Arguments />}>
      Execute
      <Static value={config.query_id} creationTitle="Add query" />
      query
    </Action>
  )
}

export const execute = (config, { queries, modules }) => {}

export const add = (config) => {}

//       {!!config.args.length && "with "}
//       {!!config.args.length &&
//         config.args.map((arg, i) =>
//           arg.type === "key" ? (
//             <Action.Group key={i}>
//               <Snippet color="gray">{arg.key}</Snippet>
//               as
//               <Value value={arg.value} />
//               {i !== config.args.length - 1 && " and "}
//             </Action.Group>
//           ) : (
//             <Value value={arg.value} />
//           )
//         )}
