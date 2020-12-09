import * as referenceRepo from "repos/reference"

const refer = (type, single, multiple) => (
  parent,
  { actionId, field, ...rest },
  { pg }
) => {
  return pg.tx(async (t) => {
    await referenceRepo.unreferAll(actionId, field, type, t)

    if (rest[single]) {
      await referenceRepo.refer(actionId, rest[single], field, type, t)

      return true
    }

    if (rest[multiple]) {
      for (let [i, id] of rest[multiple].entries()) {
        await referenceRepo.refer(actionId, id, `${field}/${i}`, type, t)
      }

      return true
    }

    return false
  })
}

const unrefer = (type) => async (parent, { actionId, field }, { pg }) => {
  await referenceRepo.unreferAll(actionId, field, type, pg)
  return true
}

export default {
  Mutation: {
    referPage: refer("pages", "pageId", "pageIds"),
    unreferPage: unrefer("pages"),
    referOperation: refer("operations", "operationId", "operationIds"),
    unreferOperation: unrefer("operations"),
    referModule: refer("modules", "moduleId", "moduleIds"),
    unreferModule: unrefer("modules"),
  },
}
