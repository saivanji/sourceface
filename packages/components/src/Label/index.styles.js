import styled from "styled-components"
import { color, fontSizes, values } from "@sourceface/style"

/* TODO: add sizes */

export const Title = styled.span`
  font-weight: 700;
  display: flex;
  align-items: center;
  color: ${color("primary-shade", 9)};
  margin-bottom: ${values[2]};
  font-size: ${fontSizes.sm};
`

export const Helper = styled.span`
  display: block;
  margin-top: ${values[1]};
  color: ${color("primary")};
  font-size: ${fontSizes.xs};
`

export const Optional = styled.span`
  font-weight: 400;
  color: ${color("primary")};
  font-size: ${fontSizes.xs};
  margin-left: ${values[1]};
`
