import React from "react"
import * as styles from "./index.styles"

export default function Input({
  size = "normal",
  className,
  style,
  iconAfter,
  iconBefore,
  error,
  ...props
}) {
  return (
    <styles.Root
      style={style}
      className={className}
      size={size}
      hasIconBefore={!!iconBefore}
      hasIconAfter={!!iconAfter}
    >
      <styles.Wrap>
        {iconBefore && <styles.IconBefore>{iconBefore}</styles.IconBefore>}
        <styles.Element hasError={!!error} {...props} />
        {iconAfter && <styles.IconAfter>{iconAfter}</styles.IconAfter>}
      </styles.Wrap>
      {error && <styles.ErrorText>{error}</styles.ErrorText>}
    </styles.Root>
  )
}
