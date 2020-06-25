// order creation will be in a modal

import React from "react"
import { useQuery } from "urql"
/* import { Button } from "packages/kit/index" */
import styles from "./index.scss"
import { Text, Table } from "./modules"

// TODO: read about suspence, data fetching, recoil

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
  const [result] = useQuery({
    query: `
      query {
        modules {
          id
          type
          config
        }
      }
   `,
  })

  return (
    <div className={styles.root}>
      {!result.data ? (
        "Page is loading..."
      ) : (
        <>
          {result.data.modules.map(module =>
            React.createElement(modules[module.type], {
              key: module.id,
              config: module.config,
            })
          )}
        </>
      )}
    </div>
  )
}

const modules = {
  text: Text,
}
