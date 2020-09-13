import "normalize.css"
import "./index.scss"

import React from "react"
import ReactDOM from "react-dom"
import { Provider as ClientProvider } from "urql"
import * as pages from "./pages"
import client from "./schema"
// import Grid from "./packages/grid/examples"

ReactDOM.render(
  <ClientProvider value={client}>
    <pages.Construction />
  </ClientProvider>,
  document.getElementById("root")
)

// TODO:
// Table module configuration
// - Total count and current page are required and by default will have internal variables as values
// - Scope variables circular dependencies
// - Think of having generic way for providing string and other data type input, since it's inconsistent for the user to have 2 inputs(template and expression)
//   - If braces are provided - then consider as template, otherthise as expression
//    - How to allow a user provide a string to input by default not surrounded by quotes? Dirty solution is to separate expressions and templates and provide ability to switch with a checkbox
// - Table row click action
// Add other modules? Input, Button
// Modules grid
//  - Should we replicate size of a draggable source or use a simple line instead?
//  - Implement nesting
//  - Be able to drag module with holding a button instead of drag handle
// Improve / Change editor UI? start with a feature approach
// Pages
// Performance optimizations
// Investigate race conditions with optimistic updates and debouncing. Additionally in the context of mutations
// Editor design(keep in mind mobile first approach)
//  - Permissions will be defined in editor for every command(because they're related to the commands)?
//    - Creating groups will be near users but assigning command to a group will be in command "permissions" tab
//  - In top right are probably display spinner icon indicating that something is saving
//  - Have multiple selections of modules?
//
// Modules
// - add uuid as id to modules. (after that modules can be created instantly with optimistic updates)
//
// Modules state
// - 2 way binding vs 1 way binding, what's better? probably 2 way. Most likely it will be done similar to redux with global state
//
// Pipelines
// - It will be a separate feature in the same row with Sources or Pages which will allow to combine multiple actions into one. Also will have another prefix in "funcs" of the engine's scope - "pipelines".
// Alternative of that feature - is custom JS. So user can define it's own functions to use in modules.
// Pipelines can be defined sequentially or asynchronously(like Promise.all)
// Real world use case: get data from one API then from second API then combine to a single object and display it in the UI
//
//
// Current:
// - Modules moving from one grid to another within nested grid doesn't work
//  - Ensure optimistic update works
//  - Ensure position is removed from the layout on back-end
// - Grid size is not updated when parent module is resized
//
// - Improve ux of modules editing
