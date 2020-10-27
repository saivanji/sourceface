import React, { createContext, useContext, useState, useRef } from "react"
import styles from "./index.scss"
import Close from "./close.svg"

const context = createContext()

export default function Autocomplete({
  children,
  placeholder,
  value,
  onChange,
}) {
  const isSingle = !(value instanceof Array)
  const values = isSingle ? [value] : value
  const placeholders = isSingle ? [placeholder] : placeholder

  const [inputs, setInputs] = useState(values.map(() => ""))
  const [focus, setFocus] = useState(0)

  const suggestions = isSingle ? children : children[focus]

  const change = (i, value) => {
    if (isSingle) {
      onChange(value)
      return
    }

    onChange(update(i, value, values))
  }

  return (
    <context.Provider value={{ change, focus }}>
      <div className={styles.root}>
        <div className={styles.head}>
          {inputs.map((input, i) => (
            <Input
              key={i}
              clearable={!!value[i]}
              placeholder={placeholders[i]}
              value={input}
              onChange={(input) =>
                setInputs((inputs) => update(i, input, inputs))
              }
              onFocus={() => setFocus(i)}
              onClear={() => change(i, undefined)}
            />
          ))}
        </div>
        <div className={styles.items}>
          {typeof suggestions === "function"
            ? suggestions(inputs[focus])
            : suggestions}
        </div>
      </div>
    </context.Provider>
  )
}

Autocomplete.Item = function AutocompleteItem({ children, value }) {
  const { change, focus } = useContext(context)

  return (
    <span className={styles.item} onClick={() => change(focus, value)}>
      {children}
    </span>
  )
}

function Input({
  clearable = false,
  autoFocus,
  placeholder,
  value,
  onFocus,
  onChange,
  onClear,
}) {
  const ref = useRef()

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
            ref.current?.focus()
            onClear()
          }}
          className={styles.clear}
        />
      )}
    </div>
  )
}

const update = (idx, value, list) =>
  list.map((item, i) => (i !== idx ? item : value))
