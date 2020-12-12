import React from "react"
import { prop } from "ramda"
import { getReference, listReferences, useAction } from "packages/factory"
import Static from "../Static"

export default function Reference({
  type,
  field,
  multiple,
  items,
  titleKey,
  creationTitle,
  editionTitle,
}) {
  const { action, onReferenceChange } = useAction()
  const data = getReference(type, field, action, multiple)

  const map = (data) => ({
    value: data.id,
    title: data[titleKey],
  })

  const listItems = (search, page) =>
    listReferences(type, { search, limit: 10, offset: page * 10 })

  return (
    <Static
      map={map}
      clearable={false}
      multiple={multiple}
      creationTitle={creationTitle}
      editionTitle={data && (editionTitle || map(data).title)}
      value={multiple ? data?.map(prop("id")) : data?.id}
      onChange={(_, x) => onReferenceChange(type, field, multiple ? x : [x])}
      items={items || listItems}
    />
  )
}
