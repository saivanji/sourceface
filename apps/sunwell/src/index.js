import "normalize.css?raw" // eslint-disable-line import/no-unresolved
import "@sourceface/components/index.css?raw" // eslint-disable-line import/no-unresolved

import React from "react"
import ReactDOM from "react-dom"
import * as pages from "./pages"
import "./index.css"

ReactDOM.render(<pages.SignIn />, document.getElementById("root"))

// - Connect fonts
// - Setup hot module replacement
//
// - Setup dynamic imports
// - Css file splitting
//
// - Implement Text component
// - Implement Space component?
//
// - css source maps are not loaded from components
