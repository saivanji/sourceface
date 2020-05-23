import React from "react"
import Spinner from "../Spinner"
import * as styles from "./index.styles"

export default function Loader({ isLoading, children, ...props }) {
  return (
    <div {...props} css={styles.root}>
      <div css={isLoading && styles.loading}>{children}</div>
      {isLoading && (
        <div css={styles.spinner}>
          <Spinner />
        </div>
      )}
    </div>
  )
}
