import React from "react"
import cx from "classnames"

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
    <input
      className={cx(
        root,
        sizes[size],
        shouldFitContainer && fullContainer,
        error ? errorBorder : border
      )}
      {...props}
    />
    <div className="text-xs text-error mt-1">{error}</div>
  </>
)

const root =
  "focus:outline-none focus:bg-white rounded-sm text-gray-shade-110 placeholder-gray border bg-gray-tint-130"
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
