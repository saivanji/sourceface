import "normalize.css?raw" // eslint-disable-line import/no-unresolved
import "@sourceface/components/index.css?raw" // eslint-disable-line import/no-unresolved

import React from "react"
import ReactDOM from "react-dom"
import * as pages from "./pages"
import "./index.css"

ReactDOM.render(<pages.SignIn />, document.getElementById("root"))

// - Connect fonts
// - Setup dynamic imports
// - Setup hot module replacement
// - minify css and generate sourcemaps
//
// - Implement Text component
// - Implement Space component?
