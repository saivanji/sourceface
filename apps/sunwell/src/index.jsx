import "normalize.css"
import "./index.scss"

import React from "react"
import ReactDOM from "react-dom"
import { Provider as ClientProvider } from "urql"
import * as pages from "./pages"
import client from "./graphql"

ReactDOM.render(
  <ClientProvider value={client}>
    <pages.Construction />
  </ClientProvider>,
  document.getElementById("root")
)

// TODO:
// Table module configuration
// - Scope Tabs
// - Total count and current page are required and by default will have internal variables as values
// - Think of having generic way for providing string and other data type input, since it's inconsistent for the user to have 2 inputs(template and expression)
//   - If braces are provided - then consider as template, otherthise as expression
//    - How to allow a user provide a string to input by default not surrounded by quotes? Dirty solution is to separate expressions and templates and provide ability to switch with a checkbox
// Add other modules? Input, Button
// Modules grid
//  - Should we replicate size of a draggable source or use a simple line instead?
//  - Implement nesting
// Improve / Change editor UI? start with a feature approach
// Pages
// Performance optimizations
// Editor design(keep in mind mobile first approach)
//  - Permissions will be defined in editor for every command(because they're related to the commands)?
//    - Creating groups will be near users but assigning command to a group will be in command "permissions" tab
//
// Modules state
// - 2 way binding vs 1 way binding, what's better?
//
//
