import React from "react"
import cx from "classnames"

export default () => (
  <div className="flex border-b border-gray">
    <Tab isSelected>Products</Tab>
    <Tab>Users</Tab>
    <Tab>Configuration</Tab>
  </div>
)

const Tab = ({ children, isSelected }) => (
  <div
    className={cx(
      "pb-3 pr-4 mr-4 -mb-px",
      isSelected && "font-bold border-b-2 border-gray-shade-80"
    )}
  >
    {children}
  </div>
)
