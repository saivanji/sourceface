import * as queryRepo from "repos/query"

const executeQuery = async (parent, { queryId }, { pg, connections }) => {
  const query = await queryRepo.byId(queryId, pg)

  return await connections[query.sourceId].execute(query)
}

export default {
  Mutation: {
    executeQuery,
  },
}
