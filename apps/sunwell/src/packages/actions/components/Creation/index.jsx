import React from "react"
import { Button } from "@sourceface/components"
import Add from "assets/add.svg"

// TODO: will have dropdown here
export default ({ className }) => (
  <Button
    className={className}
    shouldFitContainer
    size="small"
    appearance="link"
    icon={<Add />}
  >
    Add action
  </Button>
)
