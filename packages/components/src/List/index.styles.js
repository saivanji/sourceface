import styled from "styled-components"
import { color, values } from "@sourceface/style"

export const Item = styled.div`
  border-bottom: 1px solid ${color("primary-tint", 4)};
  padding: ${values[4]} 0;
  &:first-child {
    padding-top: 0;
  }
  &:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }
`
