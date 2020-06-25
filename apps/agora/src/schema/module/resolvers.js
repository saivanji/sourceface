import * as moduleRepo from "repos/module"

const modules = async (parent, args, { pg }) => {
  return await moduleRepo.all(pg)
}

export default {
  Query: {
    modules,
  },
}
