import * as queryRepo from "repos/query"
import { renderQuery } from "utils/index"

const executeQuery = async (parent, { queryId, args }, { pg, connections }) => {
  const query = await queryRepo.byId(queryId, pg)

  return await connections[query.sourceId].execute(escape =>
    renderQuery(query.value, args, escape)
  )
}

export default {
  Mutation: {
    executeQuery,
  },
}
