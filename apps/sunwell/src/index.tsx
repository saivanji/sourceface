// TODO: get rid of ts

import "normalize.css"
import "./index.scss"

import React from "react"
import ReactDOM from "react-dom"
import { createClient, Provider } from "urql"
import Editor from "packages/editor"

const endpoint = "http://localhost:5001/graphql"
const client = createClient({ url: endpoint })

ReactDOM.render(
  <Provider value={client}>
    <Editor />
  </Provider>,
  document.getElementById("root")
)
