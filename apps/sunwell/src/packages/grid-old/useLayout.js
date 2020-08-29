import { useState, useCallback } from "react"

export default initialLayout => {
  const [layout, setLayout] = useState(null)
  const [isEditing, setEditing] = useState(false)

  // update
  const onUpdate = setLayout
  // editOn
  const onEdit = useCallback(() => setEditing(true), [])
  // editOff
  const onReset = useCallback(() => {
    setLayout(null)
    setEditing(false)
  }, [])

  return [layout || initialLayout, isEditing, onEdit, onUpdate, onReset]
}
