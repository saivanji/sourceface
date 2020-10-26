import React, { useState, useRef } from "react"
import { Toggle } from "@sourceface/components"
import Close from "assets/close.svg"
import Placeholder from "../Placeholder"
import styles from "./index.scss"

// TODO: have selection in Autocomplete component(with ability to clear) and filter out selected item from a list
export default ({
  value = [],
  onChange,
  creationTitle,
  placeholders,
  suggestions,
}) => {
  const [key, setKey] = useState("")
  const [val, setVal] = useState("")
  const [focus, setFocus] = useState("key")
  const [selection, setSelection] = useState([])

  const trigger = !value.length ? (
    <Placeholder>{creationTitle}</Placeholder>
  ) : (
    // TODO: display key and value with Static and Value components?
    "Value"
  )

  const change = (i, close) => (variable, title) => {
    const item = { variable, title }

    if (selection.length === 1 && !selection[i]) {
      const data = i === 0 ? [item, selection[1]] : [selection[0], item]

      onChange(data)
      setSelection([])
      setKey("")
      setVal("")
      close()

      return
    }

    setSelection(i === 0 ? [item] : [undefined, item])
  }
  const clear = () => setSelection([])

  return (
    <Toggle trigger={trigger}>
      {(close) => (
        <div className={styles.root}>
          <div className={styles.head}>
            <Input
              autoFocus
              clearable={!!selection[0]}
              value={selection[0]?.title || key}
              placeholder={placeholders[0]}
              onChange={setKey}
              onFocus={() => setFocus("key")}
              onClear={clear}
            />
            <Input
              clearable={!!selection[1]}
              value={selection[1]?.title || val}
              onChange={setVal}
              placeholder={placeholders[1]}
              onFocus={() => setFocus("val")}
              onClear={clear}
            />
          </div>
          <div className={styles.items}>
            {focus === "key"
              ? suggestions[0](change(0, close))
              : focus === "val" && suggestions[1](change(1, close))}
          </div>
        </div>
      )}
    </Toggle>
  )
}

// TODO: implement ability to support multiple inputs for the autocomplete
// TODO: in case multiple inputs are enabled - suggestions will be provided to
// children as array of arrays.
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
