import React, { cloneElement, useState } from "react"
import cx from "classnames"
import styles from "./index.scss"

export default function Autocomplete({
  items,
  placeholder,
  custom = false,
  customSuggestion = (x) => x,
  map = (x) => x,
  filter = () => true,
  value,
  onChange,
}) {
  const [input, setInput] = useState("")
  const [hovered, setHovered] = useState(false)

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <input
          autoFocus
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className={styles.items}>
        {custom && input && !value && (
          <span className={styles.item} onClick={() => onChange(input)}>
            {customSuggestion(input)}
          </span>
        )}
        {renderSuggestions(
          ({ value, title }, isSelected) => (
            <span
              key={value}
              onMouseOver={() => !hovered && setHovered(true)}
              className={cx(
                styles.item,
                isSelected && !hovered && styles.selected
              )}
              onClick={() => onChange(value)}
            >
              {title}
            </span>
          ),
          value,
          items,
          map,
          filter
        )}
      </div>
    </div>
  )
}

Autocomplete.Stack = function AutocompleteStack({
  children,
  value = [],
  onChange,
}) {
  const initial = React.Children.toArray(children).map((_, i) => value[i])
  const [temp, setTemp] = useState(initial)
  const [focus, setFocus] = useState(0)

  const change = (i) => (value) => {
    const next = update(i, value, temp)
    setTemp(next)

    const nextFocus = next.findIndex((value) => !value)
    if (nextFocus !== -1) {
      setFocus(nextFocus)
      return
    }

    onChange(next)
  }

  return (
    <div className={styles.stack}>
      {React.Children.map(children, (item, i) => {
        if (i > focus) return null

        const value = temp[i]

        const n = focus - i

        return (
          <div
            className={cx(styles.stackItem)}
            style={{
              transform:
                i === focus
                  ? `translate(0, ${i * 10}px)`
                  : `translate(0, calc(${i * 10}px - ${5 * n}%)) scale(${
                      1 - n / 10
                    })`,
            }}
            key={i}
          >
            {cloneElement(item, { value, onChange: change(i) })}
          </div>
        )
      })}
    </div>
  )
}

function renderSuggestions(fn, value, items, map, filter) {
  return items.reduce((acc, item) => {
    const mapped = map(item)

    return !filter(mapped) ? acc : [...acc, fn(mapped, value === mapped.value)]
  }, [])
}

const update = (idx, value, list) =>
  list.map((item, i) => (i !== idx ? item : value))
