import * as queryRepo from "repos/query"

const queries = async (parent, args, { pg }) => {
  return await queryRepo.all(pg)
}

const executeQuery = async (parent, { queryId, args }, { pg, connections }) => {
  const query = await queryRepo.byId(queryId, pg)

  return await connections[query.sourceId].execute(query.config, args)
}

export default {
  Query: {
    queries,
  },
  Mutation: {
    executeQuery,
  },
}
