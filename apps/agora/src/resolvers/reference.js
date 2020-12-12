import * as referenceRepo from "repos/reference"

const refer = (
  parent,
  { actionId, field, pageIds, operationIds, moduleIds },
  { pg }
) => {
  return pg.tx(async (t) => {
    await referenceRepo.unreferAll(actionId, field, t)
    const result = { actionId, field }

    if (pageIds && pageIds.length) {
      await referenceRepo.refer(actionId, field, pageIds, "page", t)
      return result
    }

    if (operationIds && operationIds.length) {
      await referenceRepo.refer(actionId, field, operationIds, "operation", t)
      return result
    }

    if (moduleIds && moduleIds.length) {
      await referenceRepo.refer(actionId, field, moduleIds, "module", t)
      return result
    }

    throw new Error(
      "Either one of 'pageIds', 'operationIds' or 'moduleIds' is required"
    )
  })
}

const unrefer = async (parent, { actionId, field }, { pg }) => {
  await referenceRepo.unreferAll(actionId, field, pg)
  return true
}

const ids = (parent) => [parent.actionId, parent.field]

const pages = (parent, args, ctx) =>
  parent.pages || ctx.loaders.pagesByReference.load(ids(parent))

const operations = (parent, args, ctx) =>
  parent.operations || ctx.loaders.operationsByReference.load(ids(parent))

const modules = (parent, args, ctx) =>
  parent.modules || ctx.loaders.modulesByReference.load(ids(parent))

export default {
  Mutation: {
    refer,
    unrefer,
  },
  Reference: {
    pages,
    operations,
    modules,
  },
}
