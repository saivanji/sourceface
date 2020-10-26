import React from "react"
import { Toggle, Autocomplete } from "@sourceface/components"
import Snippet from "../Snippet"
import Placeholder from "../Placeholder"
import Variables from "../Variables"

// TODO: remove icons, have only colors for variable types/literals. Display icons in dropdown instead.
export default function Value({
  value,
  onChange,
  filter,
  literalAllowed = true,
  creationTitle = "Add value",
}) {
  const trigger = !value ? (
    <Placeholder>{creationTitle}</Placeholder>
  ) : value.type === "literal" ? (
    <Snippet color="beige">{value.data}</Snippet>
  ) : (
    <Snippet color="blue">{value.name}</Snippet>
  )

  return (
    <Toggle trigger={trigger}>
      {(close) => (
        <Autocomplete>
          {(value) => (
            <>
              {literalAllowed && value && (
                <Autocomplete.Item
                  onClick={() => onChange({ type: "literal", data: value })}
                >
                  Use "{value}" as literal
                </Autocomplete.Item>
              )}
              <Variables
                filter={filter}
                onItemClick={(variable) => {
                  onChange(variable)
                  close()
                }}
              />
            </>
          )}
        </Autocomplete>
      )}
    </Toggle>
  )
}
