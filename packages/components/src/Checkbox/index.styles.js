import styled, { css } from "styled-components"
import { ifProp } from "styled-tools"
import { color, fontSizes, values, rounded } from "@sourceface/style"
import OriginalIcon from "./assets/check.svg"
import { variant } from "../utils"

const sizes = variant(
  "size",
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
    ${Checkbox} {
      width: ${value};
      height: ${value};
    }
    ${Label} {
      font-size: ${fontSize};
      margin-left: ${labelOffset};
    }
  `
)

export const Checkbox = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${color("front")};
  border: 1px solid ${color("primary-tint", 4)};
  border-radius: ${rounded.sm};
`

export const Icon = styled(OriginalIcon)`
  display: none;
  fill: ${color("front")};
`

export const Root = styled.label`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  &:hover ${Checkbox} {
    background-color: ${color("primary-tint", 12)};
  }
  input[type="checkbox"] {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    &:checked + ${Checkbox} {
      background-color: ${color("primary-shade", 7)};
      border-color: ${color("primary-shade", 7)};
      ${Icon} {
        display: block;
      }
    }
    &:focus + ${Checkbox} {
      box-shadow: 0 0 0 3px $color-gray-tint-120;
    }
  }
  ${ifProp(
    "isDisabled",
    css`
      cursor: not-allowed;
      ${Checkbox} {
        background-color: ${color("primary-tint", 10)};
      }
    `
  )}
  ${sizes}
`

export const Label = styled.span`
  user-select: none;
`
