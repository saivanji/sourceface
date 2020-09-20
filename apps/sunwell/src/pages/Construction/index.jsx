// order creation will be in a modal

import React from "react"
import { DndProvider } from "react-dnd"
import { TouchBackend } from "react-dnd-touch-backend"
import { useQuery } from "urql"
import { useBooleanState } from "hooks/index"
import { Shell, Editor, Modules, When } from "components/index"
import { Container } from "packages/toolkit"
import * as stock from "packages/modules"
import * as queries from "./queries"

// TODO: think about real use case

/* <div className={styles.panel}> */
/*   <span className={styles.title}>Orders</span> */
/*   <Button className={styles.newOrder}>New order</Button> */
/* </div> */

const path = [
  { title: "Content", link: "#" },
  { title: "Orders", link: "#" },
]

// TODO: handle error on back-end requests
export default () => {
  const [result] = useQuery({
    query: queries.root,
    variables: { pageId: 1 },
  })
  const [isEditing, editOn, editOff] = useBooleanState(false)
  const page = result.data?.page

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <When
        cond={!!page}
        component={Container}
        queries={result.data?.commands}
        modules={page?.modules}
        stock={stock.dict}
      >
        {isEditing ? (
          <Editor
            layout={page?.layout}
            modules={page?.modules}
            onClose={editOff}
          />
        ) : (
          <Shell path={path} actions={<button onClick={editOn}>Edit</button>}>
            <Modules layout={page?.layout} modules={page?.modules} />
          </Shell>
        )}
      </When>
    </DndProvider>
  )
}
