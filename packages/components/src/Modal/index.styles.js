import { css } from "@emotion/core"
import {
  shadows,
  sizes,
  rounded,
  colors,
  fontSizes,
  values,
} from "@sourceface/style"
import { apply } from "../utils"

export const sizesVariants = apply(
  {
    compact: sizes.xs,
    normal: sizes.lg,
    loose: sizes["2xl"],
  },
  maxWidth =>
    css`
      max-width: ${maxWidth};
    `
)

export const root = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
`

export const overlay = css`
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
`

export const container = css`
  width: 100%;
  margin: ${values[4]};
  background-color: ${colors.light};
  border-radius: ${rounded.base};
  padding: ${values[4]};
  box-shadow: ${shadows.sm};
`

export const row = css`
  padding-bottom: ${values[4]};
  &:last-child {
    padding-bottom: 0;
  }
`

export const header = css`
  display: flex;
  align-items: center;
`

export const footer = css`
  display: flex;
`

export const title = css`
  margin: 0;
  padding: 0;
  font-weight: 700;
  font-size: ${fontSizes.lg};
  color: ${colors.primary.shades[11]};
`

export const headerIcon = css`
  display: flex;
  align-items: center;
  width: ${values[5]};
  margin-right: ${values[2]};
`

export const close = css`
  display: flex;
  margin-left: auto;
  cursor: pointer;
  border: 0;
  padding: 0;
  background: none;
  width: ${values[6]};
  & svg {
    fill: ${colors.primary.shades[8]};
    &:hover {
      fill: ${colors.primary.shades[11]};
    }
  }
  &:focus {
    outline: 0;
    border-radius: ${rounded.base};
    box-shadow: 0 0 0 3px ${colors.primary.tints[11]};
  }
`

export const actions = css`
  margin-left: auto;
  display: flex;
  align-items: center;
  padding-top: ${values[2]};
`

export const action = css`
  margin-right: ${values[2]};
  &:last-child {
    margin-right: 0;
  }
`
