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
// - Sections Accordion
// - Checkbox
// - Expression value without fetching
// - Required validation of configuration field
// - Scope Tabs
// - Total count and current page are required and by default will have internal variables as values
// - Think of having generic way for providing string and other data type input, since it's inconsistent for the user to have 2 inputs(template and expression)
//   - If braces are provided - then consider as template, otherthise as expression?
// Add other modules?
// Modules grid
// Improve / Change editor UI? start with a feature approach
// Pages
// Editor design(keep in mind mobile first approach)
//
// Modules state
// - 2 way binding vs 1 way binding, what's better?
