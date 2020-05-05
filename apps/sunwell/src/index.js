import "normalize.css?raw" // eslint-disable-line import/no-unresolved

import React from "react"
import ReactDOM from "react-dom"
import * as pages from "./pages"
import "./index.css"

ReactDOM.render(<pages.SignIn />, document.getElementById("root"))
