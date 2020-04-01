import React from "react"
import cx from "classnames"

export default () => {
  return (
    <div className="text-gray mt-1 text-xs flex flex-col">
      <Row>At least 6 characters</Row>
      <Row isCompleted>
        Should contain letters at least one uppercase letter
      </Row>
      <Row>Should contain at least one number</Row>
    </div>
  )
}

const Row = ({ children, isCompleted }) => {
  return <span className={cx(isCompleted && "line-through")}>{children}</span>
}
