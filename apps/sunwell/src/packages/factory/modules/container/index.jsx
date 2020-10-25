import React from "react"
import * as yup from "yup"
import styles from "./index.scss"

export const Root = function ContainerModule({
  config,
  layers,
  components: { Frame },
}) {
  const layer = layers.find(x => x.layoutId === config.layoutId)

  return (
    <div className={styles.root}>
      <Frame layer={layer} />
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
