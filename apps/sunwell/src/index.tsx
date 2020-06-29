// TODO: get rid of ts

import "normalize.css"
import "./index.scss"

import React from "react"
import ReactDOM from "react-dom"
import { createClient, Provider } from "urql"
import Constructor from "packages/constructor"

const endpoint = "http://localhost:5001/graphql"
const client = createClient({ url: endpoint })

ReactDOM.render(
  <Provider value={client}>
    <Constructor />
  </Provider>,
  document.getElementById("root")
)
