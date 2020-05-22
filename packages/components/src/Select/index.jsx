import React from "react"
import * as styles from "./index.styles"
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
    <styles.Root {...props} size={size}>
      <Dropdown>
        <Dropdown.Trigger style={{ width: "100%" }}>
          <styles.Element hasValue={!!value} hasError={!!error}>
            <styles.Selection>{selectedLabel || placeholder}</styles.Selection>
            <styles.Arrow />
          </styles.Element>
        </Dropdown.Trigger>
        <Dropdown.Menu style={{ width: "100%" }} position="bottomLeft">
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
      {error && <styles.ErrorText>{error}</styles.ErrorText>}
    </styles.Root>
  )
}
