import React from "react"
import { Layout } from "packages/toolkit"
import styles from "./index.scss"

// TODO: how module can have multiple layouts? have "group" module field?
export const Root = function ContainerModule() {
  return (
    <div className={styles.root}>
      <Layout />
    </div>
  )
}

export const Configuration = function ContainerModuleConfiguration() {
  return "configuration"
}

export const defaults = {}

export const size = {
  w: 6,
  h: 6,
}
