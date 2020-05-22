import styled, { css } from "styled-components"
import { color, values, rounded, fontSizes } from "@sourceface/style"
import { variant } from "../utils"

const shapes = variant(
  "shape",
  {
    rounded: rounded.full,
    squared: rounded.base,
  },
  radius => `border-radius: ${radius};`
)

const appearances = variant(
  "appearance",
  {
    primary: {
      bg: color("primary-shade", 7),
      fg: color("light"),
    },
    secondary: {
      bg: color("primary-tint", 8),
      fg: color("primary-shade", 6),
    },
  },
  ({ bg, fg }) => css`
    background-color: ${bg};
    color: ${fg};
  `
)

export const Root = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: ${fontSizes.xs};
  padding: 0 ${values[1]};
  height: ${values[4]};
  ${shapes}
  ${appearances}
`
