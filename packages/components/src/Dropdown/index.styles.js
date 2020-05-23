import { css } from "@emotion/core"
import { shadows, colors, fontSizes, values, rounded } from "@sourceface/style"

export const positions = {
  topLeft: css`
    bottom: calc(100% + ${values[2]});
    left: 0;
  `,
  topRight: css`
    bottom: calc(100% + ${values[2]});
    right: 0;
  `,
  bottomLeft: css`
    top: calc(100% + ${values[2]});
    left: 0;
  `,
  bottomRight: css`
    top: calc(100% + ${values[2]});
    right: 0;
  `,
}

export const root = css`
  position: relative;
  display: inline-flex;
`

export const menu = css`
  position: absolute;
  display: inline-flex;
  flex-direction: column;
  z-index: 1;
  background-color: ${colors.light};
  width: ${values[48]};
  border-radius: ${rounded.base};
  box-shadow: ${shadows.md};
  padding: ${values[2]} 0;
  border: 1px solid ${colors.primary.tints[8]};
`

export const item = css`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: ${fontSizes.sm};
  padding: 0 ${values[3]};
  height: ${values[8]};
  &:hover {
    background-color: ${colors.primary.tints[11]};
  }
  &:active {
    background-color: ${colors.primary.tints[10]};
  }
`
