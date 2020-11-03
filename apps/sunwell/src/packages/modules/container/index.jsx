import React from "react"
import * as yup from "yup"
import styles from "./index.scss"

export const Root = function ContainerModule({
  config,
  layouts,
  components: { Frame },
}) {
  const layout = layouts.find((x) => x.id === config.layoutId)

  return (
    <div className={styles.root}>
      <Frame layout={layout} />
    </div>
  )
}

export const Configuration = function ContainerModuleConfiguration() {
  return "configuration"
}

export const defaultConfig = {}

export const validationSchema = yup.object().shape({
  layoutId: yup.number().required(),
})

export const size = {
  w: 6,
  h: 6,
}
