import React from "react"
import { useAction } from "packages/factory"
import Static from "../Static"

export default function Relation({ type, field, titleField, creationTitle }) {
  const { relations, listAll, onRelationChange } = useAction()
  const map = (data) => ({
    value: data.id,
    title: data[titleField],
  })

  const data = relations[type]?.[field]

  const items = (search, page) =>
    listAll(type, { search, limit: 10, offset: page * 10 })

  return (
    <Static
      map={map}
      clearable={false}
      creationTitle={creationTitle}
      editionTitle={data && map(data).title}
      value={data?.id}
      onChange={(_, data) => onRelationChange(type, field, data)}
      items={items}
    />
  )
}
