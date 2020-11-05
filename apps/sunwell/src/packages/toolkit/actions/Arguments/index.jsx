import React from "react"
import { equals, update, adjust, mergeLeft } from "ramda"
import { isPlainObject } from "is-plain-object"
import Section from "../Section"
import Value from "../Value"
import Pair from "../Pair"
import styles from "./index.scss"

export default function Arguments({
  fields,
  groups,
  onFieldsChange,
  onGroupsChange,
}) {
  const keys = ["limit", "offset"].map((key) => ({ title: key, value: key }))

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
    <Section title="Input">
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
              filter={filterGroupsEdition}
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
    </Section>
  )
}

const filterGroupsEdition = ({ data }) => isPlainObject(data)

const filterGroupsCreation = (groups) => ({ definition, data }) =>
  !groups.find(equals(definition)) && isPlainObject(data)
