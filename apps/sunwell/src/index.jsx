import "normalize.css?raw" // eslint-disable-line import/no-unresolved
import "./index.css"

import React from "react"
import ReactDOM from "react-dom"
import * as pages from "./pages"

ReactDOM.render(<pages.Security />, document.getElementById("root"))
