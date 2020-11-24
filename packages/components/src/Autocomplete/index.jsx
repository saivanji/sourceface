import React, { useState } from "react"
import cx from "classnames"
import styles from "./index.scss"
import { useItems } from "./hooks"
import { listSuggestions } from "./utils"

// TODO: implement multiselect so it can be used for choosing multiple modules in
// some actions(for example in the form submission case)
export default function Autocomplete({
  items,
  placeholder,
  custom = false,
  multiple = false,
  customSuggestion = (x) => x,
  map = (x) => x,
  filter = () => true,
  renderError = () => "Failed to load data",
  value,
  onChange,
}) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  const [hovered, setHovered] = useState(false)
  const { data, error, isPaging, isSearching } = useItems(items, search, page)

  const change = (currentValue, original, isSelected) => {
    if (multiple && isSelected) {
      onChange(value.filter((x) => x !== currentValue))

      return
    }

    if (multiple && !isSelected) {
      onChange([...value, currentValue])

      return
    }

    onChange(currentValue, original)
  }

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <input
          autoFocus
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {data && isSearching && (
          <span className={styles.spinner}>Loading...</span>
        )}
      </div>
      <div className={styles.items}>
        {error ? (
          <span className={styles.info}>{renderError(error)}</span>
        ) : !data ? (
          <span className={styles.info}>Loading...</span>
        ) : (
          <>
            {custom && search && !value && (
              <span className={styles.item} onClick={() => change(search)}>
                {customSuggestion(search)}
              </span>
            )}
            {listSuggestions(
              ({ value, title }, original, isSelected) => (
                <span
                  key={value}
                  onMouseOver={() => !hovered && setHovered(true)}
                  className={cx(
                    styles.item,
                    isSelected && !hovered && styles.selected
                  )}
                  onClick={() => change(value, original, !isSelected)}
                >
                  {multiple && (
                    <input
                      className={styles.checkbox}
                      checked={isSelected}
                      type="checkbox"
                    />
                  )}
                  {title}
                </span>
              ),
              value,
              data,
              map,
              filter,
              multiple
            )}
          </>
        )}
      </div>
    </div>
  )
}
