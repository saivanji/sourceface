import React from "react"

export default function Modules({ types, onModuleClick }) {
  return types.map(type => (
    <div key={type} onClick={() => onModuleClick(type)}>
      {type}
    </div>
  ))
}
