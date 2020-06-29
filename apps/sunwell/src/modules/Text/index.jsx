import React from "react"
import { Formik, Form, Field } from "formik"
import * as yup from "yup"

function TextModule({ config, e: Expression }) {
  return <Expression input={config.value} />
}

TextModule.Configuration = function TextModuleConfiguration({ config }) {
  return (
    <Formik
      initialValues={{
        value: config.value || "",
      }}
      validationSchema={validationSchema}
      onSubmit={console.log}
    >
      <Form>
        <div>
          <b>Content:</b>
        </div>
        <Field name="value" component="input" />
        <div>
          <button type="submit">Save</button>
        </div>
      </Form>
    </Formik>
  )
}

const validationSchema = yup.object().shape({
  value: yup.string().required(),
})

export default TextModule
