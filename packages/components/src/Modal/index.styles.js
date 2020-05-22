import styled, { css } from "styled-components"
import { ifProp, ifNotProp } from "styled-tools"
import {
  shadows,
  sizes,
  rounded,
  color,
  fontSizes,
  values,
} from "@sourceface/style"
import { variant } from "../utils"

const sizesVariants = variant(
  "size",
  {
    compact: sizes.xs,
    normal: sizes.lg,
    loose: sizes["2xl"],
  },
  maxWidth => `max-width: ${maxWidth};`
)

export const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  ${ifNotProp(
    "isPortal",
    `
      position: fixed;
      z-index: 99999;
      top: 0;
      left: 0;
    `
  )}
`

export const Container = styled.div`
  width: 100%;
  margin: ${values[4]};
  background-color: ${color("front")};
  border-radius: ${rounded.base};
  padding: ${values[4]};
  box-shadow: ${shadows.sm};
  ${sizesVariants}
`

export const Row = styled.div`
  padding-bottom: ${values[4]};
  &:last-child {
    padding-bottom: 0;
  }
  ${ifProp(
    "isHeader",
    `
      display: flex;
      align-items: center;
    `
  )}
  ${ifProp(
    "isFooter",
    `
      display: flex;
    `
  )}
`

export const Title = styled.h4`
  margin: 0;
  padding: 0;
  font-weight: 700;
  font-size: ${fontSizes.lg};
  color: ${color("primary-shade", 11)};
`

export const HeaderIcon = styled.span`
  display: flex;
  align-items: center;
  width: ${values[5]};
  margin-right: ${values[2]};
`

export const Close = styled.button`
  display: flex;
  margin-left: auto;
  cursor: pointer;
  border: 0;
  padding: 0;
  background: none;
  width: ${values[6]};
  & svg {
    fill: ${color("primary-shade", 8)};
    &:hover {
      fill: ${color("primary-shade", 11)};
    }
  }
  &:focus {
    outline: 0;
    border-radius: ${rounded.base};
    box-shadow: 0 0 0 3px ${color("primary-tint", 11)};
  }
`

export const Actions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  padding-top: ${values[2]};
`

export const Action = styled.div`
  margin-right: ${values[2]};
  &:last-child {
    margin-right: 0;
  }
`
