import * as permissionRepo from "repos/permission"

const createPermission = async (parent, { name }, { pg }) => {
  return await permissionRepo.create(name, pg)
}

const removePermission = async (parent, { permissionId }, { pg }) => {
  await permissionRepo.remove(permissionId, pg)

  return true
}

const updatePermission = async (parent, { permissionId, ...data }, { pg }) =>
  await permissionRepo.update(data, permissionId, pg)

const permissions = async (parent, { limit = 10, offset = 0 }, { pg }) =>
  await permissionRepo.list(limit, offset, pg)

export default {
  Query: {
    permissions,
  },
  Mutation: {
    createPermission,
    removePermission,
    updatePermission,
  },
}
