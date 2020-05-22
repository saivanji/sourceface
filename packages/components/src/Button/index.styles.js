import styled, { css } from "styled-components"
import { ifProp, switchProp, prop } from "styled-tools"
import { color, values, rounded, fontSizes } from "@sourceface/style"
import OriginalSpinner from "../Spinner"
import { variant } from "../utils"

const sizes = variant(
  "size",
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
    ${Spinner} {
      margin-right: ${spinnerOffset};
    }
  `
)

const appearances = variant(
  "appearance",
  {
    primary: {
      bg: color("primary-shade", 7),
      fg: color("front"),
      hover: color("primary-shade", 8),
      active: color("primary-shade", 9),
      focus: color("primary-tint", 11),
      disabled: {
        bg: color("primary-tint", 7),
        fg: color("primary-shade", 9),
      },
    },
    secondary: {
      bg: color("front"),
      fg: color("primary-shade", 5),
      hover: color("primary-tint", 12),
      active: color("primary-tint", 11),
      focus: color("primary-tint", 11),
      disabled: {
        bg: color("primary-tint", 11),
        fg: color("primary-shade", 0),
      },
    },
    tertiary: {
      bg: "transparent",
      fg: color("primary-shade", 10),
      hover: color("primary-tint", 12),
      active: color("primary-tint", 11),
      focus: color("primary-tint", 11),
      disabled: {
        bg: "transparent",
        fg: color("primary-shade", 0),
      },
    },
  },
  ({ bg, fg, hover, active, focus, disabled }) => css`
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
    ${ifProp(
      "isDisabled",
      css`
        cursor: not-allowed;
        background-color: ${disabled.bg};
        color: ${disabled.fg};
      `
    )}
  `
)

const extra = switchProp(prop("appearance"), {
  secondary: css`
    border: 1px solid ${color("primary-tint", 4)};
  `,
  tertiary: `
    font-weight: 700
  `,
})

export const Root = styled.button`
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
  ${ifProp("shouldFitContainer", "width: 100%;")}
  ${sizes}
  ${appearances}
  ${extra}
`

export const Spinner = styled(OriginalSpinner)``

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
