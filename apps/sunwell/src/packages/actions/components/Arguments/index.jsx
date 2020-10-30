import React from "react"
import { equals } from "ramda"
import { isPlainObject } from "is-plain-object"
import Action from "../Action"
import Value from "../Value"
import Pair from "../Pair"
import styles from "./index.scss"

export default function Arguments({
  fields,
  groups,
  onFieldAdd,
  onFieldChange,
  onFieldRemove,
  onGroupAdd,
  onGroupChange,
  onGroupRemove,
}) {
  const addField = ([key, definition]) => onFieldAdd(key, definition)
  const keys = ["limit", "offset"].map((key) => ({ title: key, value: key }))

  return (
    <Action.Section title="Input">
      {!!fields.length && (
        <div className={styles.row}>
          {fields.map((field, i) => (
            <Pair
              key={i}
              keys={keys}
              value={[field.key, field.definition]}
              onChange={(value) =>
                !value ? onFieldRemove(i) : onFieldChange(value[1], i)
              }
            />
          ))}
        </div>
      )}
      {!!groups.length && (
        <div className={styles.row}>
          {groups.map((definition, i) => (
            <Value
              filter={filterGroupsEdition}
              value={definition}
              onChange={(definition) =>
                !definition ? onGroupRemove(i) : onGroupChange(definition, i)
              }
            />
          ))}
        </div>
      )}
      <div className={styles.row}>
        <Pair keys={keys} onChange={addField} />
        <Value
          filter={filterGroupsCreation(groups)}
          creationTitle="Add group"
          onChange={onGroupAdd}
        />
      </div>
    </Action.Section>
  )
}

const filterGroupsEdition = ({ data }) => isPlainObject(data)

const filterGroupsCreation = (groups) => ({ definition, data }) =>
  !groups.find(equals(definition)) && isPlainObject(data)
