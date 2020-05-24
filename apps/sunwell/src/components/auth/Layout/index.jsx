import React from "react"
import { useMediaQuery } from "react-responsive"
import { Card } from "@sourceface/components"
import { breakpoints } from "@sourceface/style"
import styles from "./index.scss"

export default ({ children, title, description }) => {
  const isLargeSize = useMediaQuery({ minWidth: breakpoints.lg })

  return isLargeSize ? (
    <div className={styles.root}>
      <Card className={styles.card} size="loose">
        <Info title={title} description={description} />
        {children}
      </Card>
      <Copyright />
    </div>
  ) : (
    <div className={styles.root}>
      <Info title={title} description={description} />
      {children}
      <Copyright />
    </div>
  )
}

function Copyright() {
  return (
    <span className={styles.copyright}>
      Crafted with <span>❤</span>️ by @aiven715
    </span>
  )
}

function Info({ title, description }) {
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </>
  )
}
