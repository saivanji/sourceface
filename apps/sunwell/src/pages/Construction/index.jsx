// order creation will be in a modal

import React from "react"
import { DndProvider } from "react-dnd"
import { TouchBackend } from "react-dnd-touch-backend"
import { useParams, useHistory } from "react-router-dom"
import { useQuery } from "packages/client"
import { Container, useEditor } from "packages/factory"
import { Layout } from "packages/toolkit"
import * as modulesStock from "packages/modules"
import * as actionsStock from "packages/actions"
import { Shell, Editor } from "components/index"
import * as queries from "./queries"
import createEffects from "./createEffects"

const stock = { modules: modulesStock, actions: actionsStock }

// TODO: think about real use case
// TODO: have single name for manage, content and construction
// TODO: handle error on back-end requests
// TODO: implement global loader with geometric shapes. There is no reason of displaying anything from the application
// since the app is not usable
export default () => {
  const history = useHistory()
  const { path } = useParams()
  const [result] = useQuery({
    query: queries.root,
    variables: { path },
  })

  const effects = createEffects(history)

  const page = result.data?.page

  return !page ? (
    "Loading..."
  ) : (
    <Container page={page} effects={effects} stock={stock}>
      <Page page={page} isLoading={result.fetching} />
    </Container>
  )
}

function Page({ page, isLoading }) {
  const { isEditing, edit } = useEditor()

  // TODO: replace params of route instead of passign route as link.
  // TODO: improve
  const breadcrumbs = !page
    ? []
    : [
        ...page.trail.map((x) => ({ title: x.title, to: "/e" + x.route })),
        { title: page.title },
      ]

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      {isEditing ? (
        <Editor isLoading={isLoading} />
      ) : (
        <Shell
          path={[{ title: "Content", to: "/e" }, ...breadcrumbs]}
          actions={<button onClick={() => edit(true)}>Edit</button>}
        >
          <Layout isLoading={isLoading} />
        </Shell>
      )}
    </DndProvider>
  )
}
