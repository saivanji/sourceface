import "normalize.css"
import "./index.scss"

import React from "react"
import ReactDOM from "react-dom"
import { createClient, Provider as ClientProvider } from "urql"
import { Provider as StateProvider } from "./state"
import * as pages from "./pages"

const endpoint = "http://localhost:5001/graphql"
const client = createClient({ url: endpoint })

ReactDOM.render(
  <ClientProvider value={client}>
    <StateProvider>
      <pages.Construction />
    </StateProvider>
  </ClientProvider>,
  document.getElementById("root")
)
