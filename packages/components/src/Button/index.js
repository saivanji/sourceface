import React from "react"
import cx from "classnames"
import CircleSpinner from "../CircleSpinner"
import styles from "./index.css"

export default function Button({
  children,
  appearance = "primary",
  size = "normal",
  type = "button",
  shouldFitContainer = false,
  iconAfter,
  iconBefore,
  isDisabled,
  isLoading,
  className,
}) {
  return (
    <button
      className={cx(
        className,
        styles.root,
        shouldFitContainer && styles.full,
        !isDisabled ? appearances[appearance] : disabled,
        sizes[size].base
      )}
      disabled={isDisabled}
      type={type}
    >
      {isLoading && (
        <CircleSpinner appearance="dark" className={sizes[size].spinner} />
      )}
      {children}
    </button>
  )
}

const disabled = "bg-gray-tint-80 text-gray-shade-10 cursor-not-allowed"

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
    "bg-gray-tint-70 hover:bg-gray-tint-40 active:bg-gray-tint-20 text-gray-shade-80 focus:shadow-gray-outline",
  secondary: "",
  danger: "",
}
