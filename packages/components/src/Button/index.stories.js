import React from "react"
import Button from "./index"

export default { title: "Button" }

export const compactSize = () => <Button size="compact">Compact Size</Button>
export const normalSize = () => <Button size="normal">Normal Size</Button>
export const looseSize = () => <Button size="loose">Loose Size</Button>
export const fitsContainer = () => (
  <Button shouldFitContainer>Fits Container</Button>
)
export const disabled = () => <Button isDisabled>Disabled</Button>
export const loading = () => <Button isLoading>Loading</Button>
