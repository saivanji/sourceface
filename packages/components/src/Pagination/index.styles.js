import { css } from "@emotion/core"
import { rounded, colors, fontSizes, values } from "@sourceface/style"

export const disabled = css`
  cursor: not-allowed;
  background-color: ${colors.primary.tints[11]};
  color: ${colors.primary.tints[1]};
`

export const selected = css`
  background-color: ${colors.primary.shades[7]};
  border-color: ${colors.primary.shades[7]};
  color: ${colors.light};
`

export const link = css`
  display: flex;
  align-items: center;
  margin-right: -1px;
  text-decoration: none;
  font-weight: 600;
  height: ${values[8]};
  padding-left: ${values[3]};
  padding-right: ${values[3]};
  background-color: ${colors.light};
  color: ${colors.primary.shades[5]};
  border: 1px solid ${colors.primary.tints[4]};
  &:focus {
    outline: none;
  }
  &:hover:not(${selected}, ${disabled}) {
    background-color: ${colors.primary.tints[12]};
  }
  &:active:not(${selected}, ${disabled}) {
    background-color: ${colors.primary.tints[11]};
  }
  &:focus:not(${disabled}) {
    position: relative;
    box-shadow: 0 0 0 3px ${colors.primary.tints[11]};
  }
`

export const list = css`
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
  font-size: ${fontSizes.sm};
`

export const item = css`
  user-select: none;
  &:first-child ${link} {
    border-top-left-radius: ${rounded.base};
    border-bottom-left-radius: ${rounded.base};
  }
  &:last-child ${link} {
    border-top-right-radius: ${rounded.base};
    border-bottom-right-radius: ${rounded.base};
  }
`
