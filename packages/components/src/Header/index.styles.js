import { css } from "@emotion/core"
import { colors, shadows, values } from "@sourceface/style"
import { apply } from "../utils"

export const root = css`
  box-shadow: ${shadows.base};
  padding: 0 ${values[4]};
`

export const sizes = apply(
  {
    compact: values[12],
    normal: `calc(${values[10]} + ${values[4]})`,
    loose: values[16],
  },
  height =>
    css`
      height: ${height};
    `
)

export const variants = apply(
  {
    primary: {
      bg: colors.light,
      fg: colors.primary.tints[10],
    },
    secondary: {
      bg: colors.primary.shades[9],
      fg: colors.primary.tints[6],
    },
  },
  ({ bg, fg }) => css`
    background-color: ${bg};
    color: ${fg};
  `
)
