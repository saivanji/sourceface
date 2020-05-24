import { css } from "@emotion/core"
import { colors, shadows, values, rounded } from "@sourceface/style"
import { apply } from "../utils"

export const root = css`
  box-shadow: ${shadows.sm};
  background-color: ${colors.light};
  border: 1px solid ${colors.primary.tints[8]};
`

export const sizes = apply(
  {
    compact: {
      radius: rounded.sm,
      space: values[2],
    },
    normal: {
      radius: rounded.base,
      space: values[4],
    },
    loose: {
      radius: rounded.md,
      space: values[6],
    },
  },
  ({ radius, space }) => css`
    border-radius: ${radius};
    padding: ${space};
  `
)
