import { css } from "@emotion/core"
import { colors, values, rounded, fontSizes } from "@sourceface/style"
import { apply } from "../utils"

export const root = css`
  display: inline-flex;
  align-items: center;
  font-size: ${fontSizes.xs};
  padding: 0 ${values[1]};
  height: ${values[4]};
`

export const shapes = apply(
  {
    rounded: rounded.full,
    squared: rounded.base,
  },
  radius =>
    css`
      border-radius: ${radius};
    `
)

export const variants = apply(
  {
    dark: {
      bg: colors.primary.shades[7],
      fg: colors.light,
    },
    light: {
      bg: colors.primary.tints[8],
      fg: colors.primary.shades[6],
    },
  },
  ({ bg, fg }) => css`
    background-color: ${bg};
    color: ${fg};
  `
)
