import * as sourceRepo from "repos/source"
import * as postgres from "./postgres"

const drivers = { postgres }

export default async pg => {
  const sources = await sourceRepo.all(pg)

  let connections = sources.reduce(
    (acc, source) => ({
      ...acc,
      [source.id]: makeConnection(source),
    }),
    {}
  )

  connections.add = source => {
    connections[source.id] = makeConnection(source)
  }

  return connections
}

const makeConnection = source => {
  const { connect, execute, escape } = drivers[source.database]
  const cn = connect(source.connection)

  return {
    execute: renderQuery => execute(renderQuery(escape), cn),
  }
}
