import React from "react"
import cx from "classnames"

export default ({ appearance = "dark", className }) => (
  <div
    style={style}
    className={cx(base, appearances[appearance], className)}
  ></div>
)

const style = {
  borderRightColor: "transparent",
  animation: "rotate .75s linear infinite",
}
const base = "w-3 h-3 border-2 rounded-full"

const appearances = {
  light: "border-white",
  dark: "border-primary-shade-50",
}
