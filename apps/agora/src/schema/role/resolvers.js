import * as roleRepo from "repos/role"

const createRole = async (parent, { name }, { pg }) => {
  return await roleRepo.create(name, false, pg)
}

const removeRole = async (parent, { roleId }, { pg }) => {
  await pg.task(async t => {
    const role = await roleRepo.byId(roleId, t)

    if (role.isPrivileged) {
      throw new Error("Can not remove privileged role")
    }

    await roleRepo.remove(roleId, t)
  })

  return true
}

const updateRole = async (parent, { roleId, ...data }, { pg }) =>
  await roleRepo.update(data, roleId, pg)

const assignPermission = async (parent, { roleId, permissionId }, { pg }) => {
  await roleRepo.assignPermission(roleId, permissionId, pg)

  return true
}

const roles = async (parent, { limit = 10, offset = 0 }, { pg }) =>
  await roleRepo.list(limit, offset, pg)

export default {
  Query: {
    roles,
  },
  Mutation: {
    createRole,
    removeRole,
    updateRole,
    assignPermission,
  },
}
