import { useState, useCallback } from "react"

export default initialLayout => {
  const [layout, setLayout] = useState(null)
  const [isEditing, setEditing] = useState(false)

  const onUpdate = setLayout
  const onEdit = useCallback(() => setEditing(true), [])
  const onReset = useCallback(() => {
    setLayout(null)
    setEditing(false)
  }, [])

  return [layout || initialLayout, isEditing, onEdit, onUpdate, onReset]
}
