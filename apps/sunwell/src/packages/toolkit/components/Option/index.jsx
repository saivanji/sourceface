import React, { useState } from "react"
import { Label } from "@sourceface/components"
import Braces from "assets/braces.svg"

// TODO: most likely feature of using expression to compute value of every option is reduntant,
// since for most cases values of these options are going to be customized statically instead of
// at a runtime. For example option to have the pagination available or not is rarely needed to be
// configured at a runtime.
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
