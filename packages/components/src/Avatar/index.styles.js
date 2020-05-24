import { css } from "@emotion/core"
import { colors, values, rounded, fontSizes } from "@sourceface/style"
import { apply } from "../utils"

export const root = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${rounded.full};
  background-color: ${colors.primary.shades[7]};
  color: ${colors.light};
`

export const sizes = apply(
  {
    compact: {
      value: values[6],
      fontSize: fontSizes.sm,
    },
    normal: {
      value: values[8],
      fontSize: fontSizes.lg,
    },
    loose: {
      value: values[10],
      fontSize: fontSizes.xl,
    },
  },
  ({ value, fontSize }) => css`
    width: ${value};
    height: ${value};
    font-size: ${fontSize};
  `
)

