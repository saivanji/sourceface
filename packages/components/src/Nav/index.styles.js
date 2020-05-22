import styled, { css } from "styled-components"
import { ifProp } from "styled-tools"
import { rounded, color, values } from "@sourceface/style"

export const Root = styled.div`
  width: calc(${values[10]} + ${values[4]});
  background-color: ${color("primary-shade", 11)};
  padding: 0 ${values[2]} ${values[2]};
`

/* margin: 0 -$value-2; */
/* background-color: $color-gray-shade-130; */
export const Logo = styled.div`
  height: calc(${values[10]} + ${values[4]});
  border-bottom: 1px solid ${color("primary-shade", 8)};
  margin-bottom: ${values[4]};
`

// TODO: emotion
export const Link = styled.span`
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-decoration: none;
  height: ${values[10]};
  border-radius: ${rounded.md};
  &:hover {
    background-color: ${color("primary-shade", 10)};
    & svg {
      fill: ${color("primary-tint", 1)};
    }
  }
  &:active {
    background-color: ${color("primary-shade", 9)};
    & svg {
      fill: ${color("primary-tint", 4)};
    }
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${color("primary-shade", 8)};
  }
  svg {
    fill: ${color("primary-shade", 9)};
    width: ${values[5]};
  }
  ${ifProp(
    "isSelected",
    css`
      background-color: ${color("primary-shade", 9)};
      & svg {
        fill: ${color("primary-tint", 4)};
      }
    `
  )}
`
