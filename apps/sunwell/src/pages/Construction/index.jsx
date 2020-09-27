// order creation will be in a modal

import React from "react"
import { DndProvider } from "react-dnd"
import { TouchBackend } from "react-dnd-touch-backend"
import { useParams, useHistory } from "react-router-dom"
import { useQuery } from "urql"
import { useBooleanState } from "hooks/index"
import { Shell, Editor, Modules, When } from "components/index"
import { Container } from "packages/toolkit"
import * as stock from "packages/modules"
import * as queries from "./queries"
import command from "./command"

// TODO: think about real use case

// TODO: have single name for manage, content and construction

/* <div className={styles.panel}> */
/*   <span className={styles.title}>Orders</span> */
/*   <Button className={styles.newOrder}>New order</Button> */
/* </div> */

// TODO: handle error on back-end requests
export default () => {
  const history = useHistory()
  const { path } = useParams()
  const [result] = useQuery({
    query: queries.root,
    variables: { path },
  })
  const [isEditing, editOn, editOff] = useBooleanState(false)

  const effects = {
    navigate: ({ to }) => history.push(`/e${to}`),
    command,
  }
  const page = result.data?.page

  // TODO: replace params of route instead of passign route as link.
  // TODO: improve
  const breadcrumbs = !page
    ? []
    : [
        ...page.trail.map(x => ({ title: x.title, to: "/e" + x.route })),
        { title: page.title, to: "/e/" + path },
      ]

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <When
        cond={!!page}
        component={Container}
        queries={result.data?.commands}
        modules={page?.modules}
        stock={stock.dict}
        effects={effects}
      >
        {isEditing ? (
          <Editor
            layout={page?.layout}
            modules={page?.modules}
            onClose={editOff}
          />
        ) : (
          <Shell
            path={[{ title: "Content", to: "/e" }, ...breadcrumbs]}
            actions={<button onClick={editOn}>Edit</button>}
          >
            <Modules layout={page?.layout} modules={page?.modules} />
          </Shell>
        )}
      </When>
    </DndProvider>
  )
}
