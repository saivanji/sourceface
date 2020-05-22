import styled, { css } from "styled-components"
import { ifProp, ifNotProp } from "styled-tools"
import { rounded, color, fontSizes, values } from "@sourceface/style"
import ArrowIcon from "./assets/arrow.svg"
import { variant } from "../utils"

const sizes = variant(
  "size",
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
  ({ fontSize, errorFontSize, height, space }) => `
    ${Element} {
      font-size: ${fontSize};
      height: ${height};
      padding: 0 ${space};
    }
    ${ErrorText} {
      font-size: ${errorFontSize};
    }
`
)

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  ${sizes}
`

const placeholder = css`
  color: ${color("primary")};
`

const error = css`
  border-color: ${color("primary-shade", 9)};
  &:focus {
    box-shadow: none;
  }
`

export const Element = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: ${color("primary-tint", 12)};
  color: ${color("primary-shade", 10)};
  border-radius: ${rounded.base};
  border: 1px solid ${color("primary-tint", 4)};
  cursor: pointer;
  &:focus {
    outline: none;
    background-color: ${color("light")};
    border-color: ${color("primary-tint", 9)};
    box-shadow: 0 0 0 3px ${color("primary-tint", 11)};
  }
  ${ifProp("hasError", error)}
  ${ifNotProp("hasValue", placeholder)}
`

export const Arrow = styled(ArrowIcon)`
  margin-left: auto;
  width: ${values[4]};
  fill: ${color("primary-shade", 11)};
`

export const Selection = styled.span`
  margin-right: ${values[2]};
`

export const ErrorText = styled.span`
  display: block;
  color: ${color("dark")};
  margin-top: ${values[1]};
`
