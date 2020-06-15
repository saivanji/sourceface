import React from "react"
import cx from "classnames"
import styles from "./index.scss"

export default function Button({
  children,
  size = "regular",
  type = "button",
  shouldFitContainer = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cx(
        className,
        styles.root,
        styles[size],
        shouldFitContainer && styles.full
      )}
      type={type}
    >
      {children}
    </button>
  )
}

type ButtonProps = {
  children: React.ReactNode
  size?: "small" | "regular" | "large"
  type?: "button" | "submit"
  shouldFitContainer?: boolean
  className?: string
}
