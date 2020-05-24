import { css } from "@emotion/core"
import { colors, fontSizes, values, rounded } from "@sourceface/style"
import { apply } from "../utils"

export const checkbox = css`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.light};
  border: 1px solid ${colors.primary.tints[4]};
  border-radius: ${rounded.sm};
`

export const label = css`
  user-select: none;
`

export const icon = css`
  display: none;
  fill: ${colors.light};
`

export const root = css`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  &:hover ${checkbox} {
    background-color: ${colors.primary.tints[12]};
  }
  input[type="checkbox"] {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    &:checked + ${checkbox} {
      background-color: ${colors.primary.shades[7]};
      border-color: ${colors.primary.shades[7]};
      ${icon} {
        display: block;
      }
    }
    &:focus + ${checkbox} {
      box-shadow: 0 0 0 3px $color-gray-tint-120;
    }
  }
`

export const disabled = css`
  cursor: not-allowed;
  ${checkbox} {
    background-color: ${colors.primary.tints[10]};
  }
`

export const sizes = apply(
  {
    compact: {
      value: values[4],
      fontSize: fontSizes.xs,
      labelOffset: values[1],
    },
    normal: {
      value: values[5],
      fontSize: fontSizes.sm,
      labelOffset: values[2],
    },
    loose: {
      value: values[6],
      fontSize: fontSizes.sm,
      labelOffset: values[3],
    },
  },
  ({ value, fontSize, labelOffset }) => css`
    ${checkbox} {
      width: ${value};
      height: ${value};
    }
    ${label} {
      font-size: ${fontSize};
      margin-left: ${labelOffset};
    }
  `
)
