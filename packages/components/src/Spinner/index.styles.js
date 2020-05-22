import styled, { css, keyframes } from "styled-components"
import { rounded, color, values } from "@sourceface/style"
import { variant } from "../utils"

const sizes = variant(
  "size",
  {
    compact: values[3],
    normal: values[4],
    loose: values[5],
  },
  size => `
    width: ${size};
    height: ${size};
  `
)

const appearances = variant(
  "appearance",
  {
    primary: color("primary-shade", 7),
    secondary: color("front"),
  },
  color => css`
    border-color: ${color};
  `
)

const animation = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const Root = styled.div`
  border-right-color: transparent !important;
  animation: ${animation} 0.75s linear infinite;
  border: 2px solid;
  border-radius: ${rounded.full};
  ${sizes}
  ${appearances}
`
