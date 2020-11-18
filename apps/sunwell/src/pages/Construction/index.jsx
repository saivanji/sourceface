// order creation will be in a modal

import React from "react"
import { DndProvider } from "react-dnd"
import { TouchBackend } from "react-dnd-touch-backend"
import { useParams, useHistory } from "react-router-dom"
import { useQuery } from "packages/client"
import { Container, useEditor } from "packages/factory"
import * as modulesStock from "packages/modules"
import * as actionsStock from "packages/actions"
import { Shell, Editor, Modules, When } from "components/index"
import * as queries from "./queries"
import createEffects from "./createEffects"

const stock = { modules: modulesStock, actions: actionsStock }

// TODO: think about real use case

// TODO: have single name for manage, content and construction

// TODO: handle error on back-end requests
export default () => {
  const history = useHistory()
  const { path } = useParams()
  const [result] = useQuery({
    query: queries.root,
    variables: { path },
  })

  const page = result.data?.page
  const effects = createEffects(history)

  // TODO: implement operations and queries search instead of getting all of them in the initial queries.

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <When
        cond={!!page}
        component={Container}
        page={page}
        effects={effects}
        stock={stock}
      >
        <Page path={path} page={page} />
      </When>
    </DndProvider>
  )
}

function Page({ path, page }) {
  const { isEditing, edit } = useEditor()

  // TODO: replace params of route instead of passign route as link.
  // TODO: improve
  const breadcrumbs = !page
    ? []
    : [
        ...page.trail.map((x) => ({ title: x.title, to: "/e" + x.route })),
        { title: page.title, to: "/e/" + path },
      ]

  return isEditing ? (
    <Editor />
  ) : (
    <Shell
      path={[{ title: "Content", to: "/e" }, ...breadcrumbs]}
      actions={<button onClick={() => edit(true)}>Edit</button>}
    >
      <Modules layout={page?.layout} modules={page?.modules} />
    </Shell>
  )
}
