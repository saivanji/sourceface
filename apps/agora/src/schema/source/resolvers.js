import * as commandRepo from "repos/command"

const commands = async (parent, args, { pg }) => {
  return await commandRepo.all(pg)
}

const executeCommand = async (
  parent,
  { commandId, args },
  { pg, connections }
) => {
  const command = await commandRepo.byId(commandId, pg)

  return await connections[command.sourceId].execute(command.config, args)
}

const stale = (parent, args, ctx) => ctx.loaders.staleByCommand.load(parent.id)

export default {
  Query: {
    commands,
    readCommand: executeCommand,
  },
  Mutation: {
    writeCommand: executeCommand,
  },
  Command: {
    stale,
  },
}
