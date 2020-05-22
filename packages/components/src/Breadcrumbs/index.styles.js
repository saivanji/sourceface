import styled from "styled-components"
import { color, values, rounded, fontSizes } from "@sourceface/style"

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1;
  color: ${color("primary-shade", 9)};
`

export const Path = styled.span`
  font-size: ${fontSizes.xs};
  margin-bottom: ${values[1]};
`

export const Link = styled.a`
  text-decoration: none;
  color: inherit;
  border-radius: ${rounded.base};
  &:focus {
    box-shadow: 0 0 0 3px ${color("primary-tint", 11)};
  }
`

export const Current = styled.span`
  display: block;
  font-weight: 600;
  font-size: ${fontSizes.lg};
`
