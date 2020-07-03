import React from "react"
import * as yup from "yup"
import * as system from "@sourceface/style"
import styles from "./index.scss"

// every module should have correspoding loader(depending on type)
function TextModule({ config, e: Expression, query: Query }) {
  return (
    <span
      className={styles.root}
      style={{
        fontSize: system.fontSizes[config.fontSize],
        fontWeight: system.fontWeights[config.fontWeight],
        textAlign: config.alignmentX,
        verticalAlign: config.alignmentY,
        textDecoration: config.decoration,
        color: config.color,
      }}
    >
      <Expression input={config.value} />
    </span>
  )
}

TextModule.moduleName = "text"

TextModule.Configuration = function TextModuleConfiguration({
  components: { Form, Input, Select, Row, Label },
}) {
  return (
    <Form
      defaultValues={{
        value: "",
        fontSize: system.fontSizes.lg,
        fontWeight: system.fontWeights.regular,
        alignmentX: "left",
        alignmentY: "baseline",
        decoration: "none",
        color: "#000",
      }}
      validationSchema={TextModule.validationSchema}
    >
      <Row>
        <Label title="Text">
          <Input name="value" type="text" />
        </Label>
      </Row>
      <Row>
        <Label title="Size">
          <Select name="fontSize" items={optionsProps.fontSizes} />
        </Label>
      </Row>
      <Row>
        <Label title="Font weight">
          <Select name="fontWeight" items={optionsProps.fontWeights} />
        </Label>
      </Row>
      <Row>
        <Label title="Horizontal alignment">
          <Select name="alignmentX" items={optionsProps.alignmentsX} />
        </Label>
      </Row>
      <Row>
        <Label title="Vertical alignment">
          <Select name="alignmentY" items={optionsProps.alignmentsY} />
        </Label>
      </Row>
      <Row>
        <Label title="Decoration">
          <Select name="decoration" items={optionsProps.decorations} />
        </Label>
      </Row>
      <Row>
        <Label title="Color">
          <Input name="color" type="text" />
        </Label>
      </Row>
    </Form>
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
    [name]: Object.keys(options[name]).map(key => ({
      value: key,
      title: options[name][key],
    })),
  }),
  {}
)

TextModule.validationSchema = yup.object().shape({
  value: yup.string().required(),
  fontSize: yup.string().oneOf(Object.keys(options.fontSizes)).required(),
  fontWeight: yup.string().oneOf(Object.keys(options.fontWeights)).required(),
  alignmentX: yup.string().oneOf(Object.keys(options.alignmentsX)).required(),
  alignmentY: yup.string().oneOf(Object.keys(options.alignmentsY)).required(),
  decoration: yup.string().oneOf(Object.keys(options.decorations)).required(),
  color: yup.string().max(5).required(),
})

export default TextModule
