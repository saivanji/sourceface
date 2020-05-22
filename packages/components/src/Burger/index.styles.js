import styled, { css } from "styled-components"
import { ifProp } from "styled-tools"
import { color, values, shadows } from "@sourceface/style"
import { variant } from "../utils"
import MenuIcon from "./assets/menu.svg"

const sizes = variant(
  "size",
  {
    compact: {
      value: values[12],
      icon: values[6],
    },
    normal: {
      value: `calc(${values[10]} + ${values[4]})`,
      icon: values[8],
    },
    loose: {
      value: values[16],
      icon: values[10],
    },
  },
  ({ value, icon }) => `
    width: ${value};
    height: ${value};
    ${Icon} {
      width: ${icon};
      height: ${icon};
    }
`
)

const appearances = variant(
  "appearance",
  {
    primary: {
      bg: color("primary-shade", 9),
      fg: color("primary-tint", 3),
      active: color("primary-shade", 10),
    },
    secondary: {
      bg: color("front"),
      fg: color("primary-shade", 7),
      active: color("primary-tint", 9),
    },
  },
  ({ bg, fg, active }) => css`
    background-color: ${ifProp("isActive", active, bg)};
    ${Icon} {
      fill: ${fg};
    }
  `
)

export const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${shadows.base};
  ${sizes}
  ${appearances}
`

export const Icon = styled(MenuIcon)``
