import React from "react"
import Fields from "./index"
import Input from "../Input"

const Child = () => <Input placeholder="Enter username" />

export default { title: "Fields" }

export const vertical = () => (
  <Fields direction="vertical">
    <Child />
    <Child />
    <Child />
    <Child />
  </Fields>
)
export const horizontal = () => (
  <Fields direction="horizontal">
    <Child />
    <Child />
    <Child />
    <Child />
  </Fields>
)
