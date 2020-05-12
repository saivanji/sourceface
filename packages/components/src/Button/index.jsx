import React from "react"
import cx from "classnames"
import Spinner from "../Spinner"
import styles from "./index.css"

// TODO: should link be a separate component?
export default function Button({
  children,
  appearance = "primary",
  size = "normal",
  type = "button",
  shouldFitContainer = false,
  isDisabled,
  isLoading,
  className,
  onClick,
  // iconAfter,
  // iconBefore,
}) {
  return (
    <button
      className={cx(
        className,
        styles.root,
        styles[appearance],
        styles[size],
        shouldFitContainer && styles.full,
        isDisabled && styles.disabled
      )}
      disabled={isDisabled || isLoading}
      type={type}
      onClick={onClick}
    >
      {isLoading && (
        <Spinner
          size="compact"
          appearance={getSpinnerAppearance(appearance)}
          className={styles.spinner}
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

const getSpinnerAppearance = btn =>
  Object.keys(spinners).reduce((acc, key) =>
    spinners[key].includes(btn) ? key : acc
  )
