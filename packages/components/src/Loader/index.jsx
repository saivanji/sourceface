import React from "react"
import Spinner from "../Spinner"
import * as styles from "./index.styles"

export default function Loader({ isLoading, children, ...props }) {
  return (
    <styles.Root {...props}>
      <styles.Wrap isLoading={isLoading}>{children}</styles.Wrap>
      {isLoading && (
        <styles.SpinnerWrap>
          <Spinner />
        </styles.SpinnerWrap>
      )}
    </styles.Root>
  )
}
