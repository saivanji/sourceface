import React from "react"
import cx from "classnames"
import styles from "./index.css"
import ArrowIcon from "./assets/arrow.svg"
import Dropdown, {
  DropdownButton,
  DropdownMenu,
  DropdownItem,
} from "../Dropdown"

// TODO: if select will have "clear" feature applied, display separator between arrow and clear icon
export default function Select({
  size = "normal",
  name,
  value,
  onChange,
  placeholder,
  options,
  className,
  error,
}) {
  const selectedLabel =
    value && options.find(option => option.value === value).label

  return (
    <div className={cx(styles.root, styles[size], className)}>
      <Dropdown>
        <DropdownButton className={styles.full}>
          <button
            className={cx(
              styles.element,
              !value && styles.placeholder,
              error && styles.error
            )}
          >
            <span className={styles.selection}>
              {selectedLabel || placeholder}
            </span>
            <ArrowIcon className={styles.arrow} />
          </button>
        </DropdownButton>
        <DropdownMenu position="bottomLeft" className={styles.dropdown}>
          {options.map(option => (
            <DropdownItem
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
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  )
}
