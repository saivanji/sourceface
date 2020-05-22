import styled from "styled-components"
import { ifProp } from "styled-tools"

export const Root = styled.div`
  position: relative;
`

export const Wrap = styled.div`
  ${ifProp(
    "isLoading",
    `
      opacity: 0.2;
    `
  )}
`

export const SpinnerWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
