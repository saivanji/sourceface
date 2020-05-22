import styled, { css } from "styled-components"
import { ifProp } from "styled-tools"
import { rounded, color, fontSizes, values } from "@sourceface/style"

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  margin: -${values[4]};
  font-size: ${fontSizes.sm};
`

export const Header = styled.div`
  display: flex;
  border-bottom: 1px solid ${color("primary-tint", 2)};
`

export const Body = styled.div`
  padding: ${values[4]};
`

const selected = css`
  font-weight: 700;
  border-bottom: 2px solid ${color("primary-shade", 7)};
`

export const Tab = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 0;
  border-top-left-radius: ${rounded.base};
  border-top-right-radius: ${rounded.base};
  background: none;
  margin-bottom: -1px;
  padding: 0 ${values[4]};
  height: ${values[10]};
  color: ${color("primary-shade", 7)};
  &:focus {
    outline: 0;
    background-color: ${color("light")};
    box-shadow: 0 0 0 3px ${color("primary-tint", 11)};
  }
  ${ifProp("isSelected", selected)}
`

export const IconBefore = styled.div`
  width: ${values[3]};
  margin-right: ${values[2]};
`

export const IconAfter = styled.div`
  width: ${values[3]};
  margin-left: ${values[2]};
`
