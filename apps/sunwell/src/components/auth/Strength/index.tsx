import React from "react"
import cx from "classnames"
import styles from "./index.scss"

export default () => {
  return (
    <div className={styles.root}>
      <Row>At least 6 characters</Row>
      <Row isCompleted>
        Should contain letters at least one uppercase letter
      </Row>
      <Row>Should contain at least one number</Row>
    </div>
  )
}

const Row = ({ children, isCompleted }) => {
  return <span className={cx(isCompleted && styles.completed)}>{children}</span>
}
