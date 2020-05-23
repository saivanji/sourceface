import { css } from "@emotion/core"
import { colors, values, rounded, fontSizes } from "@sourceface/style"
import { apply } from "../utils"

export const sizes = apply(
  {
    compact: {
      fontSize: fontSizes.xs,
      spinnerOffset: values[1],
      height: values[6],
      space: values[2],
    },
    normal: {
      fontSize: fontSizes.sm,
      spinnerOffset: values[2],
      height: values[8],
      space: values[3],
    },
    loose: {
      fontSize: fontSizes.sm,
      spinnerOffset: values[3],
      height: values[10],
      space: values[4],
    },
  },
  ({ fontSize, spinnerOffset, height, space }) => css`
    height: ${height};
    padding-left: ${space};
    padding-right: ${space};
    font-size: ${fontSize};
    ${spinner} {
      margin-right: ${spinnerOffset};
    }
  `
)

export const variants = apply(
  {
    primary: {
      bg: colors.primary.shades[7],
      fg: colors.light,
      hover: colors.primary.shades[8],
      active: colors.primary.shades[9],
      focus: colors.primary.tints[11],
      disabledBg: colors.primary.tints[7],
      disabledFg: colors.primary.shades[9],
    },
    secondary: {
      bg: colors.light,
      fg: colors.primary.shades[5],
      hover: colors.primary.tints[12],
      active: colors.primary.tints[11],
      focus: colors.primary.tints[11],
      disabledBg: colors.primary.tints[11],
      disabledFg: colors.primary.shades[0],
    },
    tertiary: {
      bg: "transparent",
      fg: colors.primary.shades[10],
      hover: colors.primary.tints[12],
      active: colors.primary.tints[11],
      focus: colors.primary.tints[11],
      disabledBg: "transparent",
      disabledFg: colors.primary.shades[0],
    },
  },
  ({ bg, fg, hover, active, focus, disabledBg, disabledFg }) => css`
    background-color: ${bg};
    color: ${fg};
    &:hover:not(:disabled) {
      background-color: ${hover};
    }
    &:active:not(:disabled) {
      background-color: ${active};
    }
    &:focus {
      box-shadow: 0 0 0 3px ${focus};
    }
    &${disabled} {
      background-color: ${disabledBg};
      color: ${disabledFg};
    }
  `
)

export const root = css`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 0;
  border-radius: ${rounded.base};
  &:not(:disabled) {
    cursor: pointer;
  }
  &:focus {
    outline: 0;
  }
  &${variants.secondary} {
    border: 1px solid ${colors.primary.tints[4]};
  }
  &${variants.tertiary} {
    font-weight: 700;
  }
`

export const disabled = css`
  cursor: not-allowed;
`

export const full = css`
  width: 100%;
`

export const spinner = css``

//   &.link {
//     background: none;
//     padding: 0;
//     font-weight: 700;
//     color: $color-gray-shade-110;
//     &:focus {
//       box-shadow: 0 0 0 3px $color-gray-tint-120;
//     }
//     &.disabled {
//       cursor: not-allowed;
//       color: $color-gray-shade-10;
//     }
//   }
//   &.danger {
//   }
