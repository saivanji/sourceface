import * as commandRepo from "repos/command"

const operations = (parent, { search, limit = 10, offset = 0 }, { pg }) =>
  commandRepo.list(search, limit, offset, pg)

const executeCommand = async (
  parent,
  { commandId, args },
  { pg, connections }
) => {
  const command = await commandRepo.byId(commandId, pg)

  return await connections[command.sourceId].execute(command.config, args)
}

const stale = (parent, args, ctx) => ctx.loaders.staleByCommand.load(parent.id)

// TODO: have "executeOperation" as both - read and write
export default {
  Query: {
    operations,
    readOperation: executeCommand,
  },
  Operation: {
    stale,
  },
}
