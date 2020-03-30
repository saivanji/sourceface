import React from "react"
import cx from "classnames"

export default ({
  children,
  spacing = 1,
  direction = "col",
  stretchItem,
  alignItems = "start",
  justifyContent = "start",
  className,
  onClick,
  ...props
}) => {
  const axis = { col: "b", row: "r" }[direction]
  const root = `flex flex-${direction} -m${axis}-${spacing} items-${alignItems} justify-${justifyContent}`

  return (
    <div {...props} onClick={onClick} className={cx(root, className)}>
      {React.Children.toArray(children).map((item, i) => (
        <div
          key={i}
          className={cx(
            `m${axis}-${spacing}`,
            stretchItem && "flex-1 flex-shrink-0 w-full"
          )}
        >
          {item}
        </div>
      ))}
    </div>
  )
}
