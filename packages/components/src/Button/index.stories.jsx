import React from "react"
import Button from "./index"

const text = "Click me"

export default { title: "Button" }

export const compactSize = () => <Button size="compact">{text}</Button>
export const normalSize = () => <Button size="normal">{text}</Button>
export const looseSize = () => <Button size="loose">{text}</Button>

export const primary = () => <Button appearance="primary">{text}</Button>
export const primaryDisabled = () => (
  <Button appearance="primary" isDisabled>
    {text}
  </Button>
)
export const primaryLoading = () => (
  <Button appearance="primary" isLoading>
    {text}
  </Button>
)

export const secondary = () => <Button appearance="secondary">{text}</Button>
export const secondaryDisabled = () => (
  <Button appearance="secondary" isDisabled>
    {text}
  </Button>
)
export const secondaryLoading = () => (
  <Button appearance="secondary" isLoading>
    {text}
  </Button>
)

export const link = () => <Button appearance="link">{text}</Button>
export const linkDisabled = () => (
  <Button appearance="link" isDisabled>
    {text}
  </Button>
)
export const linkLoading = () => (
  <Button appearance="link" isLoading>
    {text}
  </Button>
)

export const fitsContainer = () => <Button shouldFitContainer>{text}</Button>
