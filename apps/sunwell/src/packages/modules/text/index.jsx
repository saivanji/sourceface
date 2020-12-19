import React from "react"
import * as yup from "yup"
import * as system from "@sourceface/style"
import { Input, Select } from "@sourceface/components"
import { Option } from "packages/toolkit"
import styles from "./index.scss"

export const populate = [
  "text",
  "fontSize",
  "fontWeight",
  "alignmentX",
  "alignmentY",
  "decoration",
  "color",
]

// every module should have correspoding loader(depending on type)
export const Root = function TextModule({
  data: {
    text,
    fontSize,
    fontWeight,
    alignmentX,
    alignmentY,
    decoration,
    color,
  },
}) {
  // const [text, , pristine] = useTemplate(text)

  return (
    <span
      className={styles.root}
      style={{
        fontSize: system.fontSizes[fontSize],
        fontWeight: system.fontWeights[fontWeight],
        textAlign: alignmentX,
        verticalAlign: alignmentY,
        textDecoration: decoration,
        color: color,
      }}
    >
      {text}
    </span>
  )
}

export const Configuration = function TextModuleConfiguration() {
  return (
    <>
      <Option name="text" label="Text" type="text" component={Input} />
      <Option
        name="fontSize"
        label="size"
        items={optionsProps.fontSizes}
        component={Select}
      />
      <Option
        name="fontWeight"
        label="Font weight"
        items={optionsProps.fontWeights}
        component={Select}
      />
      <Option
        name="alignmentX"
        label="Horizontal alignment"
        items={optionsProps.alignmentsX}
        component={Select}
      />
      <Option
        name="alignmentY"
        label="Vertical alignment"
        items={optionsProps.alignmentsY}
        component={Select}
      />
      <Option
        name="decoration"
        label="Decoration"
        items={optionsProps.decorations}
        component={Select}
      />
      <Option name="color" label="Color" type="text" component={Input} />
    </>
  )
}

const options = {
  alignmentsX: { left: "Left", center: "Center", right: "Right" },
  alignmentsY: {
    baseline: "Baseline",
    top: "Top",
    middle: "Middle",
    bottom: "Bottom",
  },
  decorations: {
    none: "None",
    underline: "Underline",
    strikethrough: "Strikethrough",
  },
  fontSizes: system.fontSizes,
  fontWeights: system.fontWeights,
}

const optionsProps = Object.keys({ ...options }).reduce(
  (acc, name) => ({
    ...acc,
    [name]: Object.keys(options[name]).map((key) => ({
      value: key,
      title: options[name][key],
    })),
  }),
  {}
)

export const defaults = {
  text: "Hello world",
  fontSize: system.fontSizes.lg,
  fontWeight: system.fontWeights.regular,
  alignmentX: "left",
  alignmentY: "baseline",
  decoration: "none",
  color: "#000",
}

export const validationSchema = yup.object().shape({
  text: yup.string().required(),
  fontSize: yup.string().oneOf(Object.keys(options.fontSizes)).required(),
  fontWeight: yup.string().oneOf(Object.keys(options.fontWeights)).required(),
  alignmentX: yup.string().oneOf(Object.keys(options.alignmentsX)).required(),
  alignmentY: yup.string().oneOf(Object.keys(options.alignmentsY)).required(),
  decoration: yup.string().oneOf(Object.keys(options.decorations)).required(),
  color: yup.string().max(5).required(),
})

// export const valueTypes = {
//   text: "string",
//   color: "string",
// }

export const size = {
  w: 4,
  h: 2,
}
