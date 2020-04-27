import React from "react"
import cx from "classnames"
import { Icon } from "@sourceface/components"

export default ({
  size = "normal",
  action = "button",
  shouldFitContainer = false,
  iconAfter,
  iconBefore,
  error,
  ...props
}) => (
  <>
    <div className="relative">
      <input
        className={cx(
          root,
          sizes[size],
          shouldFitContainer && fullContainer,
          error ? errorBorder : border
        )}
        {...props}
      />
      {iconAfter && <IconAfter value={iconAfter} />}
    </div>
    {error && <div className="text-xs text-error mt-1">{error}</div>}
  </>
)

const IconAfter = ({ value }) => (
  <div className="absolute top-0 bottom-0 right-0 mr-3 flex items-center">
    {typeof value === "string" ? (
      <Icon name={value} />
    ) : (
      <div className="w-3">{value}</div>
    )}
  </div>
)

const root =
  "focus:outline-none focus:bg-white rounded text-gray-shade-110 placeholder-gray border bg-gray-tint-130"
const border =
  "border-gray-tint-50 focus:border-gray-tint-10 focus:shadow-gray-outline"
// const errorBorder = "border-error-shade-100 focus:shadow-error-outline"
const errorBorder = "border-gray-shade-100"
const fullContainer = "w-full"

const sizes = {
  compact: "h-6 px-1",
  normal: "h-8 px-2",
  loose: "h-10 px-3",
}
