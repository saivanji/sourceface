import * as query from "packages/query"

export default (history, commands) => ({
  navigate: navigate(history),
  executeCommand: executeCommand(commands),
})

const navigate = (history) => ({ to }) => history.push(`/e${to}`)

const executeCommand = (commands) => {
  const fn = ({ commandId, args }, onStale) => {
    const staleIds = commands
      .find((x) => x.id === commandId)
      .stale.map((x) => x.id)

    return query.execute(commandId, args, staleIds, onStale)
  }

  fn.readCache = query.readCache

  return fn
}
