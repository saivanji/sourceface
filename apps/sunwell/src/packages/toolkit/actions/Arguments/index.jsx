import React from "react"
import { equals, update, adjust, mergeLeft } from "ramda"
import Block from "../Block"
import Value from "../Value"
import Pair from "../Pair"
import styles from "./index.scss"

export default function Arguments({
  fields,
  groups,
  onFieldsChange,
  onGroupsChange,
}) {
  // TODO: use actual arguments
  const keys = ["limit", "offset", "id"].map((key) => ({
    title: key,
    value: key,
  }))

  const addField = ([key, definition]) =>
    onFieldsChange([...fields, { key, definition }])
  const changeField = (definition, i) =>
    onFieldsChange(adjust(i, mergeLeft({ definition }), fields))
  const removeField = (idx) =>
    onFieldsChange(fields.filter((_, i) => i !== idx))

  const addGroup = (definition) => onGroupsChange([...groups, definition])
  const changeGroup = (definition, i) =>
    onGroupsChange(update(i, definition, groups))
  const removeGroup = (idx) =>
    onGroupsChange(groups.filter((_, i) => i !== idx))

  return (
    <Block title="Input">
      {!!fields.length && (
        <div className={styles.row}>
          {fields.map((field, i) => (
            <Pair
              key={i}
              keys={keys}
              value={[field.key, field.definition]}
              onChange={([, value]) =>
                !value ? removeField(i) : changeField(value, i)
              }
            />
          ))}
        </div>
      )}
      {!!groups.length && (
        <div className={styles.row}>
          {groups.map((definition, i) => (
            <Value
              key={i}
              value={definition}
              onChange={(definition) =>
                !definition ? removeGroup(i) : changeGroup(definition, i)
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
          onChange={addGroup}
        />
      </div>
    </Block>
  )
}

const filterGroupsCreation = (groups) => ({ definition }) =>
  !groups.find(equals(definition))
