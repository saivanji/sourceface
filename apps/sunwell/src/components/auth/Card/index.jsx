import React from "react"
import Card from "@sourceface/components/card"
import styles from "./index.css"

export default ({ children, title, description }) => (
  <Card size="loose">
    <span className={styles.title}>{title}</span>
    <span className={styles.description}>{description}</span>
    {children}
  </Card>
)
