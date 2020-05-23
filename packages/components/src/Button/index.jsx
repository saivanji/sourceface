import React from "react"
import Spinner from "../Spinner"
import * as styles from "./index.styles"

// TODO: should link be a separate component?
export default function Button({
  children,
  variant = "primary",
  size = "normal",
  type = "button",
  shouldFitContainer = false,
  isDisabled,
  isLoading,
  // iconAfter,
  // iconBefore,
  ...props
}) {
  return (
    <button
      {...props}
      css={[
        styles.root,
        styles.variants[variant],
        styles.sizes[size],
        shouldFitContainer && styles.full,
        isDisabled && styles.disabled,
      ]}
      disabled={isDisabled || isLoading}
      type={type}
    >
      {isLoading && (
        <Spinner
          size="compact"
          variant={getSpinnerVariant(variant)}
          css={styles.spinner}
        />
      )}
      {children}
    </button>
  )
}

const spinners = {
  light: ["primary"],
  dark: ["secondary", "link"],
}

const getSpinnerVariant = btn =>
  Object.keys(spinners).reduce((acc, key) =>
    spinners[key].includes(btn) ? key : acc
  )
