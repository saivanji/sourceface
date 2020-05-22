import { css } from "@emotion/core"
import { colors, values, rounded, fontSizes } from "@sourceface/style"
import { variants } from "../utils"

export const sizes = variants(
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
  ({ value, fontSize }) => `
      width: ${value};
      height: ${value};
      font-size: ${fontSize};
    `
)

export const root = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${rounded.full};
  background-color: ${colors.primary.shades[7]};
  color: ${colors.light};
`
