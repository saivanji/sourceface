import { css } from "@emotion/core"
import { colors, values } from "@sourceface/style"

export const item = css`
  border-bottom: 1px solid ${colors.primary.tints[4]};
  padding: ${values[4]} 0;
  &:first-child {
    padding-top: 0;
  }
  &:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }
`
