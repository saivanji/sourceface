import React from "react"
import Input from "./index"

const props = {
  placeholder: "Please enter the text",
}

export default { title: "Input" }

export const compactSize = () => <Input {...props} size="compact" />
export const normalSize = () => <Input {...props} size="normal" />
export const looseSize = () => <Input {...props} size="loose" />
export const error = () => <Input {...props} error="This field is required" />
