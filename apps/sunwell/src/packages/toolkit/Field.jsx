import React, { useState } from "react"
import { Label } from "@sourceface/components"
import Braces from "assets/braces.svg"
// TODO: move that component here?

// TODO: also have lib/form code

export default function Field({ children, title, name, type = "combined" }) {
  // const [] = useState('plain')

  return (
    <Label
      title={title}
      trail={
        <Braces
          style={{
            width: 18,
            // backgroundColor: "#ddd",
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
