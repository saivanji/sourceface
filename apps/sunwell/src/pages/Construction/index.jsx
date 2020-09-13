// order creation will be in a modal

import React from "react"
import { DndProvider } from "react-dnd"
import { TouchBackend } from "react-dnd-touch-backend"
import { useQuery } from "urql"
import { useBooleanState } from "hooks/index"
import { Frame, Editor, Modules } from "components/index"
import * as queries from "./queries"

// TODO: think about real use case

/* <div className={styles.panel}> */
/*   <span className={styles.title}>Orders</span> */
/*   <Button className={styles.newOrder}>New order</Button> */
/* </div> */

const path = [
  { title: "Administration", link: "#" },
  { title: "Users", link: "#" },
]

// TODO: handle error on back-end requests
export default () => {
  const [result] = useQuery({
    query: queries.root,
    variables: { pageId: 1 },
  })
  const [isEditing, editOn, editOff] = useBooleanState(false)

  const modules = !result.data ? (
    "Loading..."
  ) : (
    <Modules
      queries={result.data.commands}
      modules={result.data.page.modules}
      layout={result.data.page.layout}
    />
  )

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      {isEditing ? (
        <Editor modules={result.data?.page.modules} onClose={editOff}>
          {modules}
        </Editor>
      ) : (
        <Frame path={path} actions={<button onClick={editOn}>Edit</button>}>
          {modules}
        </Frame>
      )}
    </DndProvider>
  )
}
