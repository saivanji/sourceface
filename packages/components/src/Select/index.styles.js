import { css } from "@emotion/core"
import { rounded, colors, fontSizes, values } from "@sourceface/style"
import { apply } from "../utils"

export const root = css`
  display: flex;
  flex-direction: column;
`

export const placeholder = css`
  color: ${colors.primary};
`

export const error = css`
  border-color: ${colors.primary.shades[9]};
  &:focus {
    box-shadow: none;
  }
`

export const full = css`
  width: 100%;
`

export const element = css`
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: ${colors.primary.tints[12]};
  color: ${colors.primary.shades[10]};
  border-radius: ${rounded.base};
  border: 1px solid ${colors.primary.tints[4]};
  &:focus {
    outline: none;
    background-color: ${colors.light};
    border-color: ${colors.primary.tints[9]};
    box-shadow: 0 0 0 3px ${colors.primary.tints[11]};
  }
`

export const arrow = css`
  margin-left: auto;
  width: ${values[4]};
  fill: ${colors.primary.shades[11]};
`

export const selection = css`
  margin-right: ${values[2]};
`

export const errorText = css`
  display: block;
  color: ${colors.dark};
  margin-top: ${values[1]};
`

export const sizes = apply(
  {
    compact: {
      fontSize: fontSizes.xs,
      errorFontSize: fontSizes.xs,
      height: values[6],
      space: values[1],
    },
    normal: {
      fontSize: fontSizes.sm,
      errorFontSize: fontSizes.xs,
      height: values[8],
      space: values[2],
    },
    loose: {
      fontSize: fontSizes.sm,
      errorFontSize: fontSizes.sm,
      height: values[10],
      space: values[3],
    },
  },
  ({ fontSize, errorFontSize, height, space }) => css`
    ${element} {
      font-size: ${fontSize};
      height: ${height};
      padding: 0 ${space};
    }
    ${errorText} {
      font-size: ${errorFontSize};
    }
  `
)
