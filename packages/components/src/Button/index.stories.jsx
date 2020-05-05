import React from "react"
import Button from "./index"

const text = "Click me"

export default { title: "Button" }

export const compactSize = () => <Button size="compact">{text}</Button>
export const normalSize = () => <Button size="normal">{text}</Button>
export const looseSize = () => <Button size="loose">{text}</Button>

export const primaryAppearance = () => (
  <Button appearance="primary">{text}</Button>
)
export const linkAppearance = () => <Button appearance="link">{text}</Button>

export const fitsContainer = () => <Button shouldFitContainer>{text}</Button>
export const disabled = () => <Button isDisabled>{text}</Button>
export const loading = () => <Button isLoading>{text}</Button>
