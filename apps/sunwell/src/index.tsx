// TODO: get rid of ts

import "normalize.css"
import "./index.scss"

import React from "react"
import ReactDOM from "react-dom"
import { createClient, Provider } from "urql"
import Construction from "packages/construction"

const endpoint = "http://localhost:5001/graphql"
const client = createClient({ url: endpoint })

ReactDOM.render(
  <Provider value={client}>
    <Construction />
  </Provider>,
  document.getElementById("root")
)
