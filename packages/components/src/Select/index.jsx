import React from "react"
import * as styles from "./index.styles"
import ArrowIcon from "./assets/arrow.svg"
import Dropdown from "../Dropdown"

// TODO: if select will have "clear" feature applied, display separator between arrow and clear icon
// TODO: implement isNative
export default function Select({
  size = "normal",
  name,
  value,
  onChange,
  placeholder,
  options,
  error,
  ...props
}) {
  const selectedLabel =
    value && options.find(option => option.value === value).label

  return (
    <div {...props} css={[styles.root, styles.sizes[size]]}>
      <Dropdown>
        <Dropdown.Trigger css={styles.full}>
          <button
            css={[
              styles.element,
              !value && styles.placeholder,
              error && styles.error,
            ]}
          >
            <span css={styles.selection}>{selectedLabel || placeholder}</span>
            <ArrowIcon css={styles.arrow} />
          </button>
        </Dropdown.Trigger>
        <Dropdown.Menu position="bottomLeft" css={styles.dropdown}>
          {options.map(option => (
            <Dropdown.Item
              onClick={() => {
                if (onChange) {
                  onChange({
                    target: {
                      name,
                      value: option.value,
                    },
                  })
                }
              }}
              key={option.value}
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {error && <div css={styles.errorText}>{error}</div>}
    </div>
  )
}
