import styled, { css } from "styled-components"
import { color, shadows, values } from "@sourceface/style"
import { variant } from "../utils"

const sizes = variant(
  "size",
  {
    compact: values[12],
    normal: `calc(${values[10]} + ${values[4]})`,
    loose: values[16],
  },
  height => `height: ${height};`
)

const appearances = variant(
  "appearance",
  {
    primary: {
      bg: color("light"),
      fg: color("primary-tint", 10),
    },
    secondary: {
      bg: color("primary-shade", 9),
      fg: color("primary-tint", 6),
    },
  },
  ({ bg, fg }) => css`
    background-color: ${bg};
    color: ${fg};
  `
)

export const Root = styled.div`
  box-shadow: ${shadows.base};
  padding: 0 ${values[4]};
  ${sizes}
  ${appearances}
`
