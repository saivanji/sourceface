import query from "packages/query"

export default (history, commands) => ({
  navigate: navigate(history),
  executeCommand: executeCommand(commands),
})

const navigate = history => ({ to }) => history.push(`/e${to}`)

const executeCommand = commands => ({ commandId, args }, onStale) => {
  const staleIds = commands.find(x => x.id === commandId).stale.map(x => x.id)

  return query(commandId, args, staleIds, onStale)
}
