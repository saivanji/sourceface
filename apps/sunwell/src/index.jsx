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
// Add other modules?
// Modules grid
// Improve / Change editor UI? start with a feature approach
// Pages
