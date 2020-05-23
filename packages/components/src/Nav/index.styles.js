import { css } from "@emotion/core"
import { rounded, colors, values } from "@sourceface/style"

export const root = css`
  width: calc(${values[10]} + ${values[4]});
  background-color: ${colors.primary.shades[11]};
  padding: 0 ${values[2]} ${values[2]};
`

/* margin: 0 -$value-2; */
/* background-color: $color-gray-shade-130; */
export const logo = css`
  height: calc(${values[10]} + ${values[4]});
  border-bottom: 1px solid ${colors.primary.shades[8]};
  margin-bottom: ${values[4]};
`

// TODO: emotion
export const link = css`
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-decoration: none;
  height: ${values[10]};
  border-radius: ${rounded.md};
  &:hover {
    background-color: ${colors.primary.shades[10]};
    & svg {
      fill: ${colors.primary.tints[1]};
    }
  }
  &:active {
    background-color: ${colors.primary.shades[9]};
    & svg {
      fill: ${colors.primary.tints[4]};
    }
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primary.shades[8]};
  }
  svg {
    fill: ${colors.primary.shades[9]};
    width: ${values[5]};
  }
`

export const selected = css`
  background-color: ${colors.primary.shades[9]};
  & svg {
    fill: ${colors.primary.tints[4]};
  }
`
