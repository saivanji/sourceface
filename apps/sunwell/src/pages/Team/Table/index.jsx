import React, { useContext, createContext } from "react"
import { useTable, useFlexLayout } from "react-table"
import cx from "classnames"
import styles from "./index.scss"

// side view is not a table feature. it should be implemented somewhere else, but it's a feature of table module

// table should not have so much features, complex tables should be implemented by a components composition instead. for example compose to a table side view, collapse or pagination, filters and so on
// table should have checkboxes and sorting at max probably. also implement heading groups

// TODO: implement multiple sizes

const TableContext = createContext()
const HeaderGroupContext = createContext()
const ColumnContext = createContext()
const RowContext = createContext()
const CellContext = createContext()

export default function Table({
  children,
  className,
  columns,
  data,
  ...props
}) {
  const tableProps = useTable({ columns, data }, useFlexLayout)

  return (
    <TableContext.Provider value={tableProps}>
      <div
        {...props}
        {...tableProps.getTableProps()}
        className={cx(styles.root, className)}
      >
        {children}
      </div>
    </TableContext.Provider>
  )
}

Table.Thead = function Thead({ children }) {
  const { headerGroups } = useContext(TableContext)

  return React.Children.map(children(headerGroups), (el, i) => (
    <HeaderGroupContext.Provider key={i} value={headerGroups[i]}>
      {el}
    </HeaderGroupContext.Provider>
  ))
}

Table.Th = function Th({ children, className, align = "left", ...props }) {
  const { getHeaderProps } = useContext(ColumnContext)

  return (
    <div
      {...props}
      {...getHeaderProps()}
      className={cx(styles.th, styles[alignClassNames[align]], className)}
    >
      {children}
    </div>
  )
}

Table.Tbody = function Tbody({ children }) {
  const { rows } = useContext(TableContext)
  const { prepareRow } = useContext(TableContext)

  rows.forEach(row => prepareRow(row))

  return React.Children.map(children(rows), (el, i) => (
    <RowContext.Provider key={i} value={rows[i]}>
      {el}
    </RowContext.Provider>
  ))
}

Table.Tr = function Tr({
  children,
  className,
  ...props
  // onClick,
  // isSelectable,
  // isSelected,
}) {
  const headerGroup = useContext(HeaderGroupContext)
  const row = useContext(RowContext)

  if (headerGroup) {
    return (
      <div
        {...props}
        {...headerGroup.getHeaderGroupProps()}
        className={cx(styles.tr, className)}
      >
        {React.Children.map(children, (el, i) => (
          <ColumnContext.Provider key={i} value={headerGroup.headers[i]}>
            {el}
          </ColumnContext.Provider>
        ))}
      </div>
    )
  } else {
    return (
      <div
        {...props}
        {...row.getRowProps()}
        className={cx(styles.tr, className)}
      >
        {React.Children.map(children, (el, i) => (
          <CellContext.Provider key={i} value={row.cells[i]}>
            {el}
          </CellContext.Provider>
        ))}
      </div>
    )
  }
}

Table.Td = function Td({ children, className, align = "left", ...props }) {
  const { getCellProps } = useContext(CellContext)

  return (
    <div
      {...props}
      {...getCellProps()}
      className={cx(styles.td, styles[alignClassNames[align]], className)}
    >
      {children}
    </div>
  )
}

const alignClassNames = {
  left: "alignLeft",
  center: "alignCenter",
  right: "alignRight",
}
