import * as referenceRepo from "repos/reference"

const referAction = (type, single, multiple) => async (
  parent,
  { actionId, field, ...rest },
  { pg }
) => {
  if (field.includes("/")) {
    throw new Error("/ is not allowed")
  }

  if (rest[single]) {
    await referenceRepo.referAction(actionId, rest[single], field, type, pg)

    return true
  }

  if (rest[multiple]) {
    await pg.tx(async (t) => {
      await referenceRepo.unreferAllActions(actionId, field, type, t)

      for (let [i, id] of rest[multiple].entries()) {
        await referenceRepo.referAction(actionId, id, `${field}/${i}`, type, t)
      }
    })

    return true
  }

  return false
}

const unreferAction = (type) => async (parent, { actionId, field }, { pg }) => {
  await referenceRepo.unreferAction(actionId, field, type, pg)
  return true
}

export default {
  Mutation: {
    referActionPage: referAction("pages", "pageId", "pageIds"),
    unreferActionPage: unreferAction("pages"),
    referActionOperation: referAction(
      "commands",
      "operationId",
      "operationIds"
    ),
    unreferActionOperation: unreferAction("commands"),
    referActionModule: referAction("modules", "moduleId", "moduleIds"),
    unreferActionModule: unreferAction("modules"),
  },
}
