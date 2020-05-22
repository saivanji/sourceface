import styled from "styled-components"
import { color, values, rounded, fontSizes } from "@sourceface/style"
import { variant } from "../utils"

const sizes = variant(
  "size",
  {
    compact: {
      value: values[6],
      fontSize: fontSizes.sm,
    },
    normal: {
      value: values[8],
      fontSize: fontSizes.lg,
    },
    loose: {
      value: values[10],
      fontSize: fontSizes.xl,
    },
  },
  ({ value, fontSize }) => `
      width: ${value};
      height: ${value};
      font-size: ${fontSize};
    `
)

export const Root = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${color("light")};
  background-color: ${color("primary-shade", 7)};
  border-radius: ${rounded.full};
  ${sizes}
`
