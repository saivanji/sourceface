import { css } from "@emotion/core"
import { rounded, colors, fontSizes, values } from "@sourceface/style"

export const root = css`
  padding: ${values[2]} ${values[4]};
  background-color: ${colors.primary.shades[10]};
`

export const title = css`
  display: flex;
  align-items: center;
  margin-bottom: -1px;
  height: calc(${values[10]} + ${values[2]});
  margin-bottom: ${values[4]};
  color: ${colors.light};
  font-size: ${fontSizes.xl};
  border-bottom: 1px solid ${colors.primary.shades[8]};
`

export const group = css`
  margin-left: -${values[2]};
  & + .group {
    margin-top: ${values[5]};
  }
`

export const groupTitle = css`
  text-transform: uppercase;
  font-weight: 700;
  display: block;
  padding-left: ${values[2]};
  color: ${colors.primary.shades[2]};
  font-size: ${fontSizes.xs};
  margin-bottom: ${values[1]};
`

// TODO: emotion
export const groupIcon = css`
  width: ${values[4]};
  margin-right: ${values[2]};
  fill: ${colors.primary.shades[9]};
`

export const selected = css`
  background-color: ${colors.primary.shades[11]};
  .group-icon {
    fill: ${colors.primary.tints[4]};
  }
`

export const groupLink = css`
  border: 0;
  background: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  padding: 0 $value-2;
  color: ${colors.primary.tints[9]};
  border-radius: ${rounded.md};
  height: ${values[10]};
  text-decoration: none;
  &:hover {
    background-color: ${colors.primary.shades[9]};
    .group-icon {
      fill: ${colors.primary.tints[1]};
    }
  }
  &:active {
    background-color: ${colors.primary.shades[11]};
    .group-icon {
      fill: ${colors.primary.tints[4]};
    }
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primary.shades[8]};
  }
`
