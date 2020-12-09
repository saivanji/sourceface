import * as referenceRepo from "repos/reference"

const referAction = (type, single, multiple) => (
  parent,
  { actionId, field, ...rest },
  { pg }
) => {
  return pg.tx(async (t) => {
    await referenceRepo.unreferAllActions(actionId, field, type, t)

    if (rest[single]) {
      await referenceRepo.referAction(actionId, rest[single], field, type, t)

      return true
    }

    if (rest[multiple]) {
      for (let [i, id] of rest[multiple].entries()) {
        await referenceRepo.referAction(actionId, id, `${field}/${i}`, type, t)
      }

      return true
    }

    return false
  })
}

const unreferAction = (type) => async (parent, { actionId, field }, { pg }) => {
  await referenceRepo.unreferAllActions(actionId, field, type, pg)
  return true
}

export default {
  Mutation: {
    referActionPage: referAction("pages", "pageId", "pageIds"),
    unreferActionPage: unreferAction("pages"),
    referActionOperation: referAction(
      "operations",
      "operationId",
      "operationIds"
    ),
    unreferActionOperation: unreferAction("operations"),
    referActionModule: referAction("modules", "moduleId", "moduleIds"),
    unreferActionModule: unreferAction("modules"),
  },
}
