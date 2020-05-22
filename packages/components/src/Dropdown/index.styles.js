import styled from "styled-components"
import { prop, switchProp } from "styled-tools"
import { shadows, color, fontSizes, values, rounded } from "@sourceface/style"

const position = switchProp(prop("position"), {
  topLeft: `
    bottom: calc(100% + ${values[2]});
    left: 0;
  `,
  topRight: `
    bottom: calc(100% + ${values[2]});
    right: 0;
  `,
  bottomLeft: `
    top: calc(100% + ${values[2]});
    left: 0;
  `,
  bottomRight: `
    top: calc(100% + ${values[2]});
    right: 0;
  `,
})

export const Root = styled.div`
  position: relative;
  display: inline-flex;
`

export const Menu = styled.div`
  position: absolute;
  display: inline-flex;
  flex-direction: column;
  z-index: 1;
  background-color: ${color("light")};
  width: ${values[48]};
  border-radius: ${rounded.base};
  box-shadow: ${shadows.md};
  padding: ${values[2]} 0;
  border: 1px solid ${color("primary-tint", 8)};
  ${position}
`

export const Item = styled.div`
  font-size: ${fontSizes.sm};
  padding: 0 ${values[3]};
  height: ${values[8]};
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: ${color("primary-tint", 11)};
  }
  &:active {
    background-color: ${color("primary-tint", 10)};
  }
`
