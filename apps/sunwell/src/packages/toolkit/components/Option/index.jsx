import React, { useState } from "react"
import { Label } from "@sourceface/components"
import Braces from "assets/braces.svg"

export default function Field({ children, title }) {
  return (
    <Label
      title={title}
      trail={
        <Braces
          style={{
            width: 18,
            backgroundColor: "#ddd",
            padding: 2,
            borderRadius: 4,
          }}
        />
      }
    >
      {children}
    </Label>
  )
}
