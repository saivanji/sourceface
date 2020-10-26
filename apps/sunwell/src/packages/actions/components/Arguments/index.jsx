import React from "react"
import { equals } from "ramda"
import { isPlainObject } from "is-plain-object"
import { Autocomplete } from "@sourceface/components"
import Action from "../Action"
import Static from "../Static"
import Value from "../Value"
import Pair from "../Pair"
import Variables from "../Variables"
import styles from "./index.scss"

// TODO: will have key/value split in the dropdown
// TODO: do not display display "Add group" if there is no available options
export default function Arguments({
  fields,
  groups,
  onFieldAdd,
  onGroupAdd,
  onGroupChange,
}) {
  const addField = ([key, val]) => onFieldAdd(key.variable, val.variable)

  return (
    <Action.Section title="Input">
      {!!groups.length && (
        <div className={styles.group}>
          {groups.map((variable, i) => (
            <Value
              filter={filterGroups(groups)}
              value={variable}
              onChange={(variable) => onGroupChange(variable, i)}
            />
          ))}
        </div>
      )}
      {fields.map((field, i) => (
        <Action.SectionRow key={i}>
          {
            // TODO: use Pair here. Attack key to Value inside of a Pair. Display arguments as a columns one after another not one for every row. Edit only Value in Pair, key is not editable?
          }
          {field.key}
          <Value value={field.variable} />
        </Action.SectionRow>
      ))}
      <Action.SectionRow>
        <div className={styles.creators}>
          <Pair
            creationTitle="Add key/value"
            placeholders={["Key", "Value"]}
            suggestions={[
              // TODO: with autocomplete refactoring, "onClick" handler will be passed down automatically
              (onClick) => <Keys onItemClick={onClick} />,
              (onClick) => <Variables onItemClick={onClick} />,
            ]}
            onChange={addField}
          />
          <Value
            filter={filterGroups(groups)}
            creationTitle="Add group"
            onChange={onGroupAdd}
          />
        </div>
      </Action.SectionRow>
    </Action.Section>
  )
}

function Keys({ onItemClick }) {
  const items = ["limit", "offset"]

  return items.map((key, i) => (
    <Autocomplete.Item key={i} onClick={() => onItemClick(key, key)}>
      {key}
    </Autocomplete.Item>
  ))
}

const filterGroups = (groups) => (variable, data) =>
  !groups.find(equals(variable)) && isPlainObject(data)
