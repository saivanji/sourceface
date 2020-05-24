import { css, keyframes } from "@emotion/core"
import { rounded, colors, values } from "@sourceface/style"
import { apply } from "../utils"

const animation = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const root = css`
  border-right-color: transparent !important;
  border: 2px solid;
  animation: ${animation} 0.75s linear infinite;
  border-radius: ${rounded.full};
`

export const sizes = apply(
  {
    compact: values[3],
    normal: values[4],
    loose: values[5],
  },
  size => css`
    width: ${size};
    height: ${size};
  `
)

export const variants = apply(
  {
    primary: colors.primary.shades[7],
    secondary: colors.light,
  },
  color => css`
    border-color: ${color};
  `
)
