import styled from "styled-components"
import { color, shadows, values, rounded } from "@sourceface/style"
import { variant } from "../utils"

const sizes = variant(
  "size",
  {
    compact: {
      radius: rounded.sm,
      space: values[2],
    },
    normal: {
      radius: rounded.base,
      space: values[4],
    },
    loose: {
      radius: rounded.md,
      space: values[6],
    },
  },
  ({ radius, space }) => `
    border-radius: ${radius};
    padding: ${space};
`
)

export const Root = styled.div`
  box-shadow: ${shadows.sm};
  background-color: ${color("light")};
  border: 1px solid ${color("primary-tint", 8)};
  ${sizes}
`
