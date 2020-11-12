import React, { useState } from "react"
import cx from "classnames"
import styles from "./index.scss"

// TODO: implement multiselect so it can be used for choosing multiple modules in
// some actions(for example in the form submission case)
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
      <div>
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

function renderSuggestions(fn, value, items, map, filter) {
  return items.reduce((acc, item) => {
    const mapped = map(item)

    return !filter(mapped) ? acc : [...acc, fn(mapped, value === mapped.value)]
  }, [])
}
