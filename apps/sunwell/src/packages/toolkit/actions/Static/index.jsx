import React, { cloneElement } from "react"
import { Autocomplete, Toggle } from "@sourceface/components"
import Placeholder from "../Placeholder"
import Snippet from "../Snippet"

export default function Static({
  snippetColor = "gray",
  removable = false,
  children,
  prefix,
  value,
  creationTitle,
  editionTitle,
  items,
  onChange,
  onOpen,
  onClose,
  ...props
}) {
  const trigger = !value ? (
    <Placeholder>{creationTitle}</Placeholder>
  ) : (
    <Snippet
      prefix={prefix}
      color={snippetColor}
      removable={removable}
      onRemove={() => onChange(null)}
    >
      {editionTitle || findTitle(items, value)}
    </Snippet>
  )

  return (
    <Toggle trigger={trigger} onClose={onClose} onOpen={onOpen}>
      {(close) =>
        cloneElement(children || <Static.Autocomplete />, {
          ...props,
          items,
          value,
          onChange,
          onClose: close,
        })
      }
    </Toggle>
  )
}

Static.Autocomplete = function StaticAutocomplete({
  placeholder = "Search for...",
  shouldClose = true,
  multiple,
  onChange,
  onClose,
  ...props
}) {
  return (
    <Autocomplete
      {...props}
      multiple={multiple}
      placeholder={placeholder}
      onChange={(...args) => {
        shouldClose && !multiple && onClose()
        onChange(...args)
      }}
    />
  )
}

const findTitle = (items, value) => items.find((s) => s.value === value).title
