import React from "react"
import cx from "classnames"

export default ({
  size = "normal",
  action = "button",
  shouldFitContainer = false,
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
      type="text"
      {...props}
    />
    <div className="text-xs text-error mt-1">{error}</div>
  </>
)

const root =
  "focus:outline-none rounded-sm text-sm text-primary-shade-110 placeholder-gray border"
const border =
  "border-gray-tint-10 focus:border-primary-tint-30 focus:shadow-primary-outline"
const errorBorder = "border-error-shade-10 focus:shadow-error-outline"
const fullContainer = "w-full"

const sizes = {
  compact: "h-6 px-1",
  normal: "h-8 px-2",
  loose: "h-10 px-3",
}
