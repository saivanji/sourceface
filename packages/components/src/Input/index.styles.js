import styled, { css } from "styled-components"
import { ifProp } from "styled-tools"
import { rounded, color, fontSizes, values } from "@sourceface/style"
import { variant } from "../utils"

const sizes = variant(
  "size",
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
    ${Wrap} {
      height: ${height};
    }
    ${Element} {
      font-size: ${fontSize};
      padding: 0 ${space};
    }
    ${IconBefore},
    ${IconAfter} {
      width: ${iconWidth};
    }
    ${IconBefore} {
      margin-left: ${iconOffset};
    }
    ${IconAfter} {
      margin-right: ${iconOffset};
    }
    ${ErrorText} {
      font-size: ${errorFontSize};
    }
    ${ifProp(
      "hasIconBefore",
      `
        ${Element} {
          padding-left: ${iconSpace};
        }
      `
    )}
    ${ifProp(
      "hasIconAfter",
      `
        ${Element} {
          padding-right: ${iconSpace};
        }
      `
    )}
  `
)

export const Root = styled.div`
  ${sizes}
`

export const Wrap = styled.div`
  position: relative;
`

export const Element = styled.input`
  width: 100%;
  height: 100%;
  background-color: ${color("primary-tint", 12)};
  color: ${color("primary-shade", 10)};
  border-radius: ${rounded.base};
  border: 1px solid ${color("primary-tint", 4)};
  &:focus {
    background-color: ${color("light")};
    border-color: ${color("primary-tint", 9)};
    box-shadow: 0 0 0 3px ${color("primary-tint", 11)};
  }
  &::placeholder {
    color: ${color("primary-shade", 2)};
  }
  ${ifProp(
    "hasError",
    css`
      border-color: ${color("primary-shade", 9)};
      &:focus {
        box-shadow: none;
      }
    `
  )}
`

const icon = css`
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
`

export const IconBefore = styled.div`
  ${icon}
  left: 0;
`

export const IconAfter = styled.div`
  ${icon}
  right: 0;
`

export const ErrorText = styled.span`
  display: block;
  color: ${color("dark")};
  margin-top: ${values[1]};
`
