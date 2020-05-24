import { css } from "@emotion/core"
import { rounded, colors, values } from "@sourceface/style"
import { apply } from "../utils"

const borderColor = colors.primary.tints[4]

export const bordered = css`
  border: 1px solid ${borderColor};
  border-radius: ${rounded.base};
`

export const th = css`
  font-weight: 600;
  display: flex;
  align-items: center;
`

export const td = css`
  display: flex;
  align-items: center;
`

export const tr = css`
  display: flex;
  border-bottom: 1px solid ${borderColor};
  &:last-child {
    border-bottom: 0;
  }
`

export const thead = css``

export const tbody = css``

export const root = css``

export const sizes = apply(
  {
    compact: values[2],
    normal: values[4],
    loose: values[6],
  },
  spacing =>
    css`
    ${th}, ${td} {
      &:not(:first-child, :last-child) {
        padding-left: ${spacing};
        padding-right: ${spacing};
      }
      &:first-child {
        padding-right: ${spacing};
      }
      &:last-child {
        padding-left: ${spacing};
      }
    }

    ${tr}:not(:first-child) {
      padding-top: ${spacing};
    }

    ${tr}:not(:last-child) {
      padding-bottom: ${spacing};
    }

    ${tbody} + ${thead},
    ${thead} + ${tbody},
    ${tbody} + ${tbody},
    ${thead} + ${thead} {
      margin-top: ${spacing};
      padding-top: ${spacing};
      border-top: 1px solid ${borderColor};
    }

    &${bordered} {
      padding-top: ${spacing};
      padding-bottom: ${spacing};
      ${th},
      ${td} {
        &:first-child,
        &:last-child {
          padding-left: ${spacing};
          padding-right: ${spacing};
        }
      }
    }
  `
)

export const align = apply(
  {
    left: "flex-start",
    center: "center",
    right: "end",
  },
  value => css`
    justify-content: ${value};
  `
)
