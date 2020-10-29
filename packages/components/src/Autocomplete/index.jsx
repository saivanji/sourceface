import React, { forwardRef, useState, useRef } from "react"
import styles from "./index.scss"
import Close from "./close.svg"

// TODO "custom" should be as array
// TODO when entering anything in empty input while having 1 section it automatically calls "onChange"
// TODO: have stacked autocomplete as a replacement for multiple sections? That will simplify Autocomplete code and
// will and will provide simpler UX. Probably have is as Autocomplete.Stack, which accepts pure Autocomplete as children
export default function Autocomplete({
  items,
  placeholder,
  clearable = true,
  custom = false,
  customSuggestion = (x) => x,
  map,
  filter,
  value,
  onChange,
}) {
  const [inputs, connect] = useRefs()
  const {
    sections,
    currentInput,
    currentValue,
    selectFocus,
    change,
    changeSection,
    renderSuggestions,
  } = useSections(value, items, placeholder, inputs, map, filter, onChange)

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        {sections.map(({ input, placeholder, isFocused, value }, i) => (
          <Input
            ref={connect(i)}
            key={i}
            autoFocus={isFocused}
            clearable={clearable && !!value}
            placeholder={placeholder}
            value={input}
            onChange={(input) => changeSection(i, "input", input)}
            onClear={() => changeSection(i, "value", null)}
            onFocus={() => selectFocus(i)}
          />
        ))}
      </div>
      <div className={styles.items}>
        {custom && currentInput && !currentValue && (
          <span
            className={styles.item}
            onClick={() => change("value", currentInput)}
          >
            {customSuggestion(currentInput)}
          </span>
        )}
        {renderSuggestions(({ value, title }) => (
          <span
            key={value}
            className={styles.item}
            onClick={() => change("value", value)}
          >
            {title}
          </span>
        ))}
      </div>
    </div>
  )
}

const Input = forwardRef(function Input(
  {
    clearable = false,
    autoFocus,
    placeholder,
    value,
    onFocus,
    onChange,
    onClear,
  },
  ref
) {
  // const local = useRef()

  return (
    <div className={styles.input}>
      <input
        ref={ref}
        type="text"
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={value}
        onFocus={onFocus}
        onChange={(e) => onChange(e.target.value)}
      />
      {clearable && (
        <Close
          onClick={() => {
            // ref.current?.focus()
            onClear()
          }}
          className={styles.clear}
        />
      )}
    </div>
  )
})

const useRefs = () => {
  const ref = useRef({})

  return [
    ref.current,
    (i) => (node) => {
      ref.current[i] = node
    },
  ]
}

const useSections = (
  value,
  items,
  placeholder,
  inputs,
  map,
  filter,
  onChange
) => {
  const isSingle = !(value instanceof Array)
  const values = isSingle ? [value] : value
  const placeholders = isSingle ? [placeholder] : placeholder

  const defaultMap = (x) => x
  const defaultFilter = () => true
  const createMap = (i) => (isSingle ? map : map && map[i]) || defaultMap
  const createFilter = (i) =>
    (isSingle ? filter : filter && filter[i]) || defaultFilter

  const [focus, selectFocus] = useState(0)
  const [sections, setSections] = useState(
    values.map((data, i) => assoc("value", data, i))
  )
  const current = sections[focus]
  const suggestions = isSingle ? items : items[focus]

  function assoc(type, data, i) {
    return {
      input:
        type === "input"
          ? data
          : findTitle(isSingle, i, data, createMap(i), items),
      value: type === "value" ? data : null,
      placeholder: placeholders[i],
      isFocused: focus === i,
    }
  }

  function changeSection(i, type, data) {
    const updated = update(i, assoc(type, data, i), sections)

    setSections(updated)

    if (shouldSubmit(updated)) {
      const values = updated.map((x) => x.value)
      onChange(isSingle ? values[0] : values)
      return
    }

    if (!isSingle && focus < value.length - 1) {
      const nextFocus = focus + 1

      inputs[nextFocus].focus()
      selectFocus(nextFocus)
    }
  }

  function renderSuggestions(fn) {
    const map = createMap(focus)
    const filter = createFilter(focus)

    return current.value
      ? traverse(
          fn,
          map,
          (x) => x.value !== current.value && filter(x),
          suggestions
        )
      : traverse(fn, map, filter, suggestions)
  }

  return {
    sections,
    currentInput: current.input,
    currentValue: current.value,
    change: (...args) => changeSection(focus, ...args),
    changeSection,
    selectFocus,
    renderSuggestions,
  }
}

const shouldSubmit = (sections) =>
  sections.every((item) => !item.value) ||
  sections.every((item) => !!item.value)

const findTitle = (isSingle, i, value, map, items) => {
  const found = (isSingle ? items : items[i]).find(
    (x) => map(x).value === value
  )

  return (found && map(found).title) || ""
}

const traverse = (fn, map, filter, items) =>
  items.reduce(
    (acc, item) => (!filter(map(item)) ? acc : [...acc, fn(map(item))]),
    []
  )

const update = (idx, value, list) =>
  list.map((item, i) => (i !== idx ? item : value))
