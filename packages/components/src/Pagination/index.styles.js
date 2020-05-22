import styled, { css } from "styled-components"
import { ifProp } from "styled-tools"
import { rounded, color, fontSizes, values } from "@sourceface/style"

const withClickable = css => props =>
  !props.isSelected && !props.isDisabled && css

const linkDisabled = css`
  cursor: not-allowed;
  background-color: ${color("primary-tint", 11)};
  color: ${color("primary-tint", 1)};
`

const linkSelected = css`
  background-color: ${color("primary-shade", 7)};
  border-color: ${color("primary-shade", 7)};
  color: ${color("front")};
`

const linkClickable = css`
  &:hover {
    background-color: ${color("primary-tint", 12)};
  }
  &:active {
    background-color: ${color("primary-tint", 11)};
  }
  &:focus {
    position: relative;
    box-shadow: 0 0 0 3px ${color("primary-tint", 11)};
  }
`

export const Link = styled.a`
  display: flex;
  align-items: center;
  margin-right: -1px;
  text-decoration: none;
  font-weight: 600;
  height: ${values[8]};
  padding-left: ${values[3]};
  padding-right: ${values[3]};
  background-color: ${color("front")};
  color: ${color("primary-shade", 5)};
  border: 1px solid ${color("primary-tint", 4)};
  &:focus {
    outline: none;
  }
  ${ifProp("isDisabled", linkDisabled)}
  ${ifProp("isSelected", linkSelected)}
  ${withClickable(linkClickable)}
`

export const List = styled.ul`
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
  font-size: ${fontSizes.sm};
`

export const Item = styled.li`
  user-select: none;
  &:first-child ${Link} {
    border-top-left-radius: ${rounded.base};
    border-bottom-left-radius: ${rounded.base};
  }
  &:last-child ${Link} {
    border-top-right-radius: ${rounded.base};
    border-bottom-right-radius: ${rounded.base};
  }
`
