import { css } from "@emotion/core"
import { rounded, colors, fontSizes, values } from "@sourceface/style"

export const root = css`
  display: flex;
  flex-direction: column;
  margin: -${values[4]};
  font-size: ${fontSizes.sm};
`

export const header = css`
  display: flex;
  border-bottom: 1px solid ${colors.primary.tints[2]};
`

export const body = css`
  padding: ${values[4]};
`

export const selected = css`
  font-weight: 700;
  border-bottom: 2px solid ${colors.primary.shades[7]};
`

export const tab = css`
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 0;
  border-top-left-radius: ${rounded.base};
  border-top-right-radius: ${rounded.base};
  background: none;
  margin-bottom: -1px;
  padding: 0 ${values[4]};
  height: ${values[10]};
  color: ${colors.primary.shades[7]};
  &:focus {
    outline: 0;
    background-color: ${colors.light};
    box-shadow: 0 0 0 3px ${colors.primary.tints[11]};
  }
`

export const iconBefore = css`
  width: ${values[3]};
  margin-right: ${values[2]};
`

export const iconAfter = css`
  width: ${values[3]};
  margin-left: ${values[2]};
`
