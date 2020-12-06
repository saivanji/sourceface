import * as referenceRepo from "repos/reference"

const referActionPage = async (parent, { actionId, pageId, field }, { pg }) => {
  await referenceRepo.referActionPage(actionId, pageId, field, pg)
  return true
}

const unreferActionPage = async (parent, { actionId, field }, { pg }) => {
  await referenceRepo.unreferActionPage(actionId, field, pg)
  return true
}

const referActionOperation = async (
  parent,
  { actionId, operationId, field },
  { pg }
) => {
  await referenceRepo.referActionOperation(actionId, operationId, field, pg)
  return true
}

const unreferActionOperation = async (parent, { actionId, field }, { pg }) => {
  await referenceRepo.unreferActionOperation(actionId, field, pg)
  return true
}

const referActionModule = async (
  parent,
  { actionId, moduleId, field },
  { pg }
) => {
  await referenceRepo.referActionModule(actionId, moduleId, field, pg)
  return true
}

const unreferActionModule = async (parent, { actionId, field }, { pg }) => {
  await referenceRepo.unreferActionModule(actionId, field, pg)
  return true
}

export default {
  Mutation: {
    referActionPage,
    unreferActionPage,
    referActionOperation,
    unreferActionOperation,
    referActionModule,
    unreferActionModule,
  },
}
