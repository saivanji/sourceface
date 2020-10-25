// order creation will be in a modal

import React from "react"
import { DndProvider } from "react-dnd"
import { TouchBackend } from "react-dnd-touch-backend"
import { useParams, useHistory } from "react-router-dom"
import { useQuery } from "urql"
import { useBooleanState } from "hooks/index"
import { Shell, Editor, Modules, When } from "components/index"
import * as factory from "packages/factory"
import * as modulesStock from "packages/modules"
import * as actionsStock from "packages/actions"
import * as queries from "./queries"
import createEffects from "./createEffects"

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
  const [isEditing, editOn, editOff] = useBooleanState(false)

  const page = result.data?.page
  const effects = createEffects(history, result.data?.commands)
  const stock = { modules: modulesStock, actions: actionsStock }

  // TODO: replace params of route instead of passign route as link.
  // TODO: improve
  const breadcrumbs = !page
    ? []
    : [
        ...page.trail.map((x) => ({ title: x.title, to: "/e" + x.route })),
        { title: page.title, to: "/e/" + path },
      ]

  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <When
        cond={!!page}
        component={factory.Container}
        queries={result.data?.commands}
        modules={result.data?.page.modules}
        effects={effects}
        stock={stock}
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
