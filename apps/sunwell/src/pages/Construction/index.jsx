// order creation will be in a modal

import React, { createContext, useContext } from "react"
import { useQuery } from "urql"
/* import { Button } from "packages/kit/index" */
import { Text, Table } from "modules/index"
import { When, Frame } from "components/index"
import * as state from "state.js"
import Expression from "./Expression"
import styles from "./index.scss"
import * as schema from "./schema"

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

export const context = createContext({})

export default () => {
  const { isEditing, enableEditMode } = useContext(state.context)
  const [result] = useQuery({
    query: schema.root,
  })

  return (
    <When cond={!isEditing} component={Frame}>
      <div className={styles.root}>
        {!result.data ? (
          "Page is loading..."
        ) : (
          <context.Provider value={result.data}>
            {result.data.modules.map(module =>
              React.createElement(modules[module.type], {
                key: module.id,
                config: module.config,
                e: Expression,
              })
            )}
          </context.Provider>
        )}
      </div>
    </When>
  )
}

const modules = {
  text: Text,
  table: Table,
}
