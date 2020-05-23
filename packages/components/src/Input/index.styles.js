import { css } from "@emotion/core"
import { rounded, colors, fontSizes, values } from "@sourceface/style"
import { apply } from "../utils"

export const sizes = apply(
  {
    compact: {
      fontSize: fontSizes.xs,
      errorFontSize: fontSizes.xs,
      height: values[6],
      space: values[1],
      iconWidth: values[2],
      iconOffset: values[2],
      iconSpace: values[6],
    },
    normal: {
      fontSize: fontSizes.sm,
      errorFontSize: fontSizes.xs,
      height: values[8],
      space: values[2],
      iconWidth: values[3],
      iconOffset: values[3],
      iconSpace: values[8],
    },
    loose: {
      fontSize: fontSizes.sm,
      errorFontSize: fontSizes.sm,
      height: values[10],
      space: values[3],
      iconWidth: values[4],
      iconOffset: values[4],
      iconSpace: values[10],
    },
  },
  ({
    fontSize,
    errorFontSize,
    height,
    space,
    iconWidth,
    iconOffset,
    iconSpace,
  }) => css`
    ${wrap} {
      height: ${height};
    }
    ${element} {
      font-size: ${fontSize};
      padding: 0 ${space};
    }
    ${iconBefore},
    ${iconAfter} {
      width: ${iconWidth};
    }
    ${iconBefore} {
      margin-left: ${iconOffset};
    }
    ${iconAfter} {
      margin-right: ${iconOffset};
    }
    ${errorText} {
      font-size: ${errorFontSize};
    }
    &${hasIconBefore} {
      ${element} {
        padding-left: ${iconSpace};
      }
    }
    &${hasIconAfter} {
      ${element} {
        padding-left: ${iconSpace};
      }
    }
  `
)

export const root = css``

export const wrap = css`
  position: relative;
`

export const element = css`
  width: 100%;
  height: 100%;
  background-color: ${colors.primary.tints[12]};
  color: ${colors.primary.shades[10]};
  border-radius: ${rounded.base};
  border: 1px solid ${colors.primary.tints[4]};
  &:focus {
    background-color: ${colors.light};
    border-color: ${colors.primary.tints[9]};
    box-shadow: 0 0 0 3px ${colors.primary.tints[11]};
  }
  &::placeholder {
    color: ${colors.primary.shades[2]};
  }
`

export const error = css`
  border-color: ${colors.primary.shades[9]};
  &:focus {
    box-shadow: none;
  }
`

const icon = css`
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
`

export const iconBefore = css`
  ${icon}
  left: 0;
`

export const iconAfter = css`
  ${icon}
  right: 0;
`

export const errorText = css`
  display: block;
  color: ${colors.dark};
  margin-top: ${values[1]};
`

export const hasIconBefore = css``
export const hasIconAfter = css``
