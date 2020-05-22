import styled, { css } from "styled-components"
import { prop, switchProp, ifProp } from "styled-tools"
import { rounded, color, values } from "@sourceface/style"
import { variant } from "../utils"

const borderColor = color("primary-tint", 4)

const cell = css`
  display: flex;
  align-items: center;
  justify-content: ${switchProp(prop("align"), {
    left: "flex-start",
    center: "center",
    right: "end",
  })};
`

const bordered = spacing => css`
  border: 1px solid ${borderColor};
  border-radius: ${rounded.base};
  padding-top: ${spacing};
  padding-bottom: ${spacing};
  ${Th},
  ${Td} {
    &:first-child,
    &:last-child {
      padding-left: ${spacing};
      padding-right: ${spacing};
    }
  }
`

const sizes = variant(
  "size",
  {
    compact: values[2],
    normal: values[4],
    loose: values[6],
  },
  spacing =>
    !console.log(spacing) &&
    css`
    ${Th}, ${Td} {
      &:not(:first-child, :last-child) {
        padding-left: ${spacing};
        padding-right: ${spacing};
      }
      &:first-child {
        padding-right: ${spacing};
      }
      &:last-child {
        padding-left: ${spacing};
      }
    }

    ${Tr}:not(:first-child) {
      padding-top: ${spacing};
    }

    ${Tr}:not(:last-child) {
      padding-bottom: ${spacing};
    }

    ${Tbody} + ${Thead},
    ${Thead} + ${Tbody},
    ${Tbody} + ${Tbody},
    ${Thead} + ${Thead} {
      margin-top: ${spacing};
      padding-top: ${spacing};
      border-top: 1px solid ${borderColor};
    }

    ${ifProp("bordered", bordered(spacing))}
`
)

export const Thead = styled.div``

export const Tbody = styled.div``

export const Root = styled.div`
  ${sizes}
`

export const Th = styled.div`
  font-weight: 600;
  ${cell}
`

export const Td = styled.div`
  ${cell}
`

export const Tr = styled.div`
  display: flex;
  border-bottom: 1px solid ${borderColor};
  &:last-child {
    border-bottom: 0;
  }
`
