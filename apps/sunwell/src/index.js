import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import * as pages from "./pages"

ReactDOM.render(<pages.SignIn />, document.getElementById("root"))

// - Connect normalize.css
// - Connect fonts
// - Setup dynamic imports
// - Setup hot module replacement
// - Keep generated css in the external file
//
// - Implement Text component
// - Implement Space component?
//
// - Minification of components css
// - Most likely remove client webpack configuration from config and have separate configuration for components and app
