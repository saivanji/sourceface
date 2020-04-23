import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import * as auth from "./pages/auth"
import cmp from "@sourceface/components"

console.log(cmp)

ReactDOM.render(<auth.SignIn />, document.getElementById("root"))
