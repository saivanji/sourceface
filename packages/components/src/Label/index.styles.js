import { css } from "@emotion/core"
import { colors, fontSizes, values } from "@sourceface/style"

/* TODO: add sizes */

export const title = css`
  font-weight: 700;
  display: flex;
  align-items: center;
  color: ${colors.primary.shades[9]};
  margin-bottom: ${values[2]};
  font-size: ${fontSizes.sm};
`

export const helper = css`
  display: block;
  margin-top: ${values[1]};
  color: ${colors.primary};
  font-size: ${fontSizes.xs};
`

export const optional = css`
  font-weight: 400;
  color: ${colors.primary};
  font-size: ${fontSizes.xs};
  margin-left: ${values[1]};
`
