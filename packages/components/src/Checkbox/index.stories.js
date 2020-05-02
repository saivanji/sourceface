import React from "react"
import Checkbox from "./index"

const props = {
  label: "Are you sure?",
}

export default { title: "Checkbox" }

export const compactSize = () => <Checkbox {...props} size="compact"></Checkbox>
export const normalSize = () => <Checkbox {...props} size="normal"></Checkbox>
export const looseSize = () => <Checkbox {...props} size="loose"></Checkbox>
export const disabled = () => <Checkbox {...props} isDisabled></Checkbox>
