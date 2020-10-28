import React from "react"
import { equals } from "ramda"
import { isPlainObject } from "is-plain-object"
import Action from "../Action"
import Value from "../Value"
import Pair from "../Pair"
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
  const addField = ([key, val]) => onFieldAdd(key, val)
  const keys = ["limit", "offset"].map((key) => ({ title: key, value: key }))

  return (
    <Action.Section title="Input">
      {!!groups.length && (
        <div className={styles.groups}>
          {groups.map((variable, i) => (
            <Value
              filter={filterGroups(groups)}
              value={variable}
              onChange={(variable) => onGroupChange(variable, i)}
            />
          ))}
        </div>
      )}
      {!!fields.length && (
        <div className={styles.fields}>
          {fields.map((field, i) => (
            <Pair
              key={i}
              placeholders={["Key", "Value"]}
              keys={keys}
              value={[field.key, field.variable]}
              onChange={console.log}
            />
          ))}
        </div>
      )}
      <div className={styles.creators}>
        <Pair
          creationTitle="Add key/value"
          placeholders={["Key", "Value"]}
          onChange={addField}
          keys={keys}
        />
        <Value
          filter={filterGroups(groups)}
          creationTitle="Add group"
          onChange={onGroupAdd}
        />
      </div>
    </Action.Section>
  )
}

// TODO: use Pair here. Attach key to Value inside of a Pair. Display arguments as a columns one after another not one for every row. Edit only Value in Pair, key is not editable?
const filterGroups = (groups) => ({ definition, data }) =>
  !groups.find(equals(definition)) && isPlainObject(data)
