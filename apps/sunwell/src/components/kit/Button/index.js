import React from "react"
import cx from "classnames"
import Spinner from "../Spinner"

export default ({
  children,
  appearance = "primary",
  size = "normal",
  action = "button",
  shouldFitContainer = false,
  iconAfter,
  iconBefore,
  isDisabled,
  isLoading,
}) => (
  <button
    className={cx(
      root,
      shouldFitContainer && fullContainer,
      !isDisabled ? appearances[appearance] : disabled,
      sizes[size].base
    )}
    disabled={isDisabled}
    type={action}
  >
    {isLoading && (
      <Spinner appearance="light" className={sizes[size].spinner} />
    )}
    {children}
  </button>
)

const root =
  "focus:outline-none flex justify-center items-center rounded-sm text-sm"
const fullContainer = "w-full"
const disabled = "bg-gray-tint-40 text-gray-shade-10 cursor-not-allowed"

const sizes = {
  compact: {
    base: "h-6 px-2",
    spinner: "mr-1",
  },
  normal: {
    base: "h-8 px-3",
    spinner: "mr-2",
  },
  loose: {
    base: "h-10 px-4",
    spinner: "mr-3",
  },
}

const appearances = {
  primary:
    "bg-primary hover:bg-primary-shade-10 active:bg-primary-shade-20 text-white focus:shadow-primary-outline",
  secondary: "",
  danger: "",
}
