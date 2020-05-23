import React from "react"
import * as styles from "./index.styles"

export default function Input({
  size = "normal",
  iconAfter,
  iconBefore,
  error,
  ...props
}) {
  return (
    <div css={[styles.root, styles.sizes[size]]}>
      <div css={styles.wrap}>
        {iconBefore && <div css={styles.iconBefore}>{iconBefore}</div>}
        <input
          css={[
            styles.element,
            error && styles.error,
            iconBefore && styles.hasIconBefore,
            iconAfter && styles.hasIconAfter,
          ]}
          {...props}
        />
        {iconAfter && <div css={styles.iconAfter}>{iconAfter}</div>}
      </div>
      {error && <div css={styles.errorText}>{error}</div>}
    </div>
  )
}
