import React, { cloneElement, createContext, useContext } from "react"
import * as styles from "./index.styles"

// side view is not a table feature. it should be implemented somewhere else, but it's a feature of table module

// table should not have so much features, complex tables should be implemented by a components composition instead. for example compose to a table side view, collapse or pagination, filters and so on
// table should have checkboxes and sorting at max probably. also implement heading groups

const Context = createContext()

export default function Table({
  children,
  columns,
  size = "normal",
  bordered = false,
  ...props
}) {
  return (
    <Context.Provider value={{ columns }}>
      <styles.Root bordered={bordered} size={size} {...props}>
        {children}
      </styles.Root>
    </Context.Provider>
  )
}

Table.Tr = function Tr({
  children,
  ...props
  // onClick,
  // isSelectable,
  // isSelected,
}) {
  const { columns } = useContext(Context)
  const count = React.Children.count(children)
  const widths = calcWidths(columns || new Array(count).fill("auto"))

  return (
    <styles.Tr {...props}>
      {React.Children.map(children, (el, i) =>
        cloneElement(el, {
          style: { width: widths[i] },
        })
      )}
    </styles.Tr>
  )
}

Table.Thead = styles.Thead
Table.Tbody = styles.Tbody
Table.Th = styles.Th
Table.Td = styles.Td

const calcWidths = columns => {
  const autoCount = columns.filter(el => el == "auto").length
  const customCols = columns.filter(el => el !== "auto").join(" + ") || "0px"

  const widths = columns.map(el =>
    el !== "auto" ? el : `calc((100% - calc(${customCols})) / ${autoCount})`
  )

  return widths
}
