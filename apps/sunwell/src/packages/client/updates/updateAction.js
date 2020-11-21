import { parse } from "graphql"
import { values } from "ramda"

export default (result, { actionId }, cache) => {
  const { relations } = result.updateAction

  const pages = values(relations.pages).map((pageId) =>
    cache.readFragment(pageFragment, { id: pageId })
  )
  const commands = values(relations.commands).map((commandId) =>
    cache.readFragment(commandFragment, { id: commandId })
  )

  cache.writeFragment(actionFragment, {
    id: actionId,
    pages,
    commands,
  })
}

const actionFragment = parse(`
  fragment _ on Action {
    id
    pages {
      id
    }
    commands {
      id
      stale {
        id
      }
    }
  }
`)

const pageFragment = parse(`
  fragment _ on Page {
    id
    title
  }
`)

const commandFragment = parse(`
  fragment _ on Command {
    id
    name
    stale {
      id
    }
  }
`)
