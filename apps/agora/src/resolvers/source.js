import * as operationRepo from "repos/operation"

const operations = (parent, { search, limit = 10, offset = 0 }, { pg }) =>
  operationRepo.list(search, limit, offset, pg)

const executeOperation = async (
  parent,
  { operationId, args },
  { pg, connections }
) => {
  const operation = await operationRepo.byId(operationId, pg)

  return await connections[operation.sourceId].execute(operation.config, args)
}

const stale = (parent, args, ctx) => ctx.loaders.staleByCommand.load(parent.id)

// TODO: have "executeOperation" as both - read and write
export default {
  Query: {
    operations,
    readOperation: executeOperation,
  },
  Operation: {
    stale,
  },
}
