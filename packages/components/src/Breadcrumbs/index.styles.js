import { css } from "@emotion/core"
import { colors, values, rounded, fontSizes } from "@sourceface/style"

export const root = css`
  display: flex;
  flex-direction: column;
  line-height: 1;
  color: ${colors.primary.shades[9]};
`

export const path = css`
  font-size: ${fontSizes.xs};
  margin-bottom: ${values[1]};
`

export const link = css`
  text-decoration: none;
  color: inherit;
  border-radius: ${rounded.base};
  &:focus {
    box-shadow: 0 0 0 3px ${colors.primary.tints[11]};
  }
`

export const current = css`
  display: block;
  font-weight: 600;
  font-size: ${fontSizes.lg};
`
