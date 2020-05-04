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
//
// - build components for prod and dev at the same time
// - minified version will provide sourcemaps and have .min.js name with .min.js.map
// - unminified will provide sourcemaps as well
// - css will provide source maps
// - will live in lib dir
// - depending on env will do a corresponding export in index.js(like in react). have development env first convention in sourceface app?
//
// - check best practices how other libraries do
// - how to export dev css?
