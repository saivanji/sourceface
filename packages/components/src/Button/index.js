import React from "react"
import * as styles from "./index.styles"

export default function Button({ isLoading, children, ...props }) {
  return (
    <styles.Root {...props} disabled={props.isDisabled || isLoading}>
      {isLoading && (
        <styles.Spinner
          size="compact"
          appearance={getSpinnerAppearance(props.appearance)}
        />
      )}
      {children}
    </styles.Root>
  )
}

Button.defaultProps = {
  appearance: "primary",
  size: "normal",
  type: "button",
  shouldFitContainer: false,
  isDisabled: false,
  isLoading: false,
}

const spinners = {
  light: ["primary"],
  dark: ["secondary", "tertiary"],
}

const getSpinnerAppearance = btn =>
  Object.keys(spinners).reduce((acc, key) =>
    spinners[key].includes(btn) ? key : acc
  )
