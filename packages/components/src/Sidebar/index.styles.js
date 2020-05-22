import styled, { css } from "styled-components"
import { ifProp } from "styled-tools"
import { rounded, color, fontSizes, values } from "@sourceface/style"

export const Root = styled.div`
  padding: ${values[2]} ${values[4]};
  background-color: ${color("primary-shade", 10)};
`

export const Title = styled.span`
  display: flex;
  align-items: center;
  margin-bottom: -1px;
  height: calc(${values[10]} + ${values[2]});
  margin-bottom: ${values[4]};
  color: ${color("light")};
  font-size: ${fontSizes.xl};
  border-bottom: 1px solid ${color("primary-shade", 8)};
`

export const Group = styled.div`
  margin-left: -${values[2]};
  & + .group {
    margin-top: ${values[5]};
  }
`

export const GroupTitle = styled.span`
  text-transform: uppercase;
  font-weight: 700;
  display: block;
  padding-left: ${values[2]};
  color: ${color("primary-shade", 2)};
  font-size: ${fontSizes.xs};
  margin-bottom: ${values[1]};
`

// TODO: emotion
export const GroupIcon = styled.div`
  width: ${values[4]};
  margin-right: ${values[2]};
  fill: ${color("primary-shade", 9)};
`

const selected = css`
  background-color: ${color("primary-shade", 11)};
  .group-icon {
    fill: ${color("primary-tint", 4)};
  }
`

export const GroupLink = styled.div`
  border: 0;
  background: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  padding: 0 $value-2;
  color: ${color("primary-tint", 9)};
  border-radius: ${rounded.md};
  height: ${values[10]};
  text-decoration: none;
  &:hover {
    background-color: ${color("primary-shade", 9)};
    .group-icon {
      fill: ${color("primary-tint", 1)};
    }
  }
  &:active {
    background-color: ${color("primary-shade", 11)};
    .group-icon {
      fill: ${color("primary-tint", 4)};
    }
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${color("primary-shade", 8)};
  }
  ${ifProp("isSelected", selected)}
`
