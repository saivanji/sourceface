import React from "react"
import { Button } from "@sourceface/components"
import Add from "assets/add.svg"

export default ({ children, className }) => (
  <Button className={className} size="small" appearance="link" icon={<Add />}>
    {children}
  </Button>
)
