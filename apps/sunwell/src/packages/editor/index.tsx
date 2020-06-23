// order creation will be in a modal

import React from "react"
/* import { Button } from "packages/kit/index" */
import styles from "./index.scss"
import { Text } from "packages/modules"

// TODO: start defining editor interface with simple text module, which can display free form string or data from the query

/* <Breadcrumbs */
/*   path={[ */
/*     { title: "Administration", link: "#" }, */
/*     { title: "Users", link: "#" }, */
/*   ]} */
/* /> */

/* <div className={styles.panel}> */
/*   <span className={styles.title}>Orders</span> */
/*   <Button className={styles.newOrder}>New order</Button> */
/* </div> */

export default () => {
  return (
    <div className={styles.root}>
      <Text />
    </div>
  )
}
