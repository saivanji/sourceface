// TODO: get rid of ts

import "normalize.css"
import "./index.scss"

import React from "react"
import ReactDOM from "react-dom"
import { createClient, Provider as ClientProvider } from "urql"
import * as pages from "./pages"

const endpoint = "http://localhost:5001/graphql"
const client = createClient({ url: endpoint })

ReactDOM.render(
  <ClientProvider value={client}>
    <pages.Construction />
  </ClientProvider>,
  document.getElementById("root")
)
