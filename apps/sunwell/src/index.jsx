import "normalize.css"
import "./index.scss"

import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Route } from "react-router-dom"
import { Provider as ClientProvider } from "urql"
import * as pages from "./pages"
import client from "./schema"
// import Grid from "./packages/grid/examples"

ReactDOM.render(
  <ClientProvider value={client}>
    <BrowserRouter>
      <Route exact path="/">
        Home
      </Route>
      <Route exact path="/e/:path*">
        <pages.Construction />
      </Route>
    </BrowserRouter>
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
// Improve / Change editor UI? start with a feature approach
// Pages
// Performance optimizations
// Investigate race conditions with optimistic updates and debouncing. Additionally in the context of mutations
// Editor design(keep in mind mobile first approach)
//  - Permissions will be defined in editor for every command(because they're related to the commands)?
//    - Creating groups will be near users but assigning command to a group will be in command "permissions" tab
//    - TODO: rethink permissions, might need to set only on module level.
//  - In top right are probably display spinner icon indicating that something is saving
//  - Have multiple selections of modules?
//  - Have ability to duplicate the module(useful for example when creating form inputs)
//
// Cache logged in user information in the local storage in order not to display global loader when application is loaded.
//
// Modules
// - add uuid as id to modules. (after that modules can be created instantly with optimistic updates)
//
// Modules state
// - 2 way binding vs 1 way binding, what's better? probably 2 way. Most likely it will be done similar to redux with global state
//
// Validations
// - Have ability to create validation schemas to validate the data
// - yup under the hood
//
// Pipelines
// - It will be a separate feature in the same row with Sources or Pages which will allow to combine multiple actions into one. Also will have another prefix in "funcs" of the engine's scope - "pipelines".
// Alternative of that feature - is custom JS. So user can define it's own functions to use in modules.(JS might not be a good fit since pipelining is pretty common situtation, and it's not a great idea to make user write JS code all the time)
// Whether pipelines are defined globally(resuable) or locally(inline in the place we use engine code)
// Pipelines can be defined sequentially or asynchronously(like Promise.all)
// Real world use case: get data from one API then from second API then combine to a single object and display it in the UI
//
// Dependent queries
// - Once one query will be executed, a set of queries which needs to be executed afterwards might be specified. (invalidation)
//
// Consider having slots. One slot(position in back-end) might have multiple modules. Only one module might be visible in a slot at a time using a condition. For example when rows in a table are selected - display delete button, otherwise another module. Or depending on user role - display different module.
//
// Current:
// - Implement form support
//   // TODO: how to higlight invalid inputs when "core.validate" is used? Referencing input by usage of validation schema might not work,
//   since the same schema might be used in another module and will be highlighted accidentally.
//   // TODO: should Validations be created globally or locally?
//   - Inline pipelines
//     - -> core.validate data: state.orderForm, schema: schemas.order
//     - -> queries.createOrder data: state.orderForm
//     - -> core.navigate to: '/orders'
//   - Global Validation schemas conception
//   - Global state support
//   - Defining value and change handler on the input(by default will be used internal ones)
//   - Defining validation schema for the input field(will use schema defined globally)
// - Multiple pages support
// - Find various simple real world use-cases
//
// - Modules moving from one grid to another within nested grid doesn't work
//  - Ensure optimistic update works
//  - Ensure position is removed from the layout on back-end
// - Grid size is not updated when parent module is resized
//
// - Improve ux of modules editing
