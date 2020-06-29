import util from "util"
import * as userRepo from "repos/user"
import * as invitationRepo from "repos/invitation"
import * as roleRepo from "repos/role"

const initialSignUp = async (parent, args, { pg, session }) => {
  return await pg.tx(async t => {
    const role = await roleRepo.create("admin", true, t)
    await roleRepo.create("manager", false, t)
    const user = await userRepo.create(args, role.id, t)

    session.userId = user.id
    return user
  })
}

const invitationSignUp = async (
  parent,
  { username, email, password, invitationId },
  { pg, session }
) => {
  return await pg.tx(async t => {
    const invitation = await invitationRepo.byId(invitationId, t)
    const user = await userRepo.create(
      { username, email, password },
      invitation.roleId,
      pg
    )
    await invitationRepo.remove(invitationId, t)

    session.userId = user.id

    return user
  })
}

const signInLocal = async (parent, args, { pg, session }) => {
  const user = await userRepo.checkPassword(args, pg)
  session.userId = user.id
  return user
}

const signOut = async (parent, _args, { session }) => {
  await util.promisify(session.destroy.bind(session))()
  return true
}

// not using destructuring for `context`. Since pg-session deletes `session` object
// upon calling `regenerate` and spawning a new instance afterwards.
const changePassword = async (parent, args, context) => {
  const { userId } = context.session
  await userRepo.changePassword(args, userId, context.pg)

  await util.promisify(context.session.regenerate.bind(context.session))()
  context.session.userId = userId

  return true
}

const invite = async (parent, args, { pg }) =>
  await invitationRepo.create(args, pg)

const myself = async (parent, _args, { pg, session }) => {
  return await userRepo.getById(session.userId, pg)
}

const hasUsers = async (parent, _args, { pg }) => {
  return await userRepo.hasUsers(pg)
}

const users = async (parent, { limit = 10, offset = 0 }, { pg }) =>
  await userRepo.list(limit, offset, pg)

const removeUser = async (parent, { userId }, { pg, session }) => {
  if (session.userId === userId) {
    throw new Error("Can not remove yourself")
  }

  await userRepo.remove(userId, pg)

  return true
}

const changeUserPassword = async (parent, { userId, password }, { pg }) => {
  await userRepo.setPassword(password, userId, pg)

  return true
}

const assignRole = async (parent, { userId, roleId }, { pg, context }) => {
  if (userId === context.session.userId) {
    throw new Error("Can not change the role for yourself")
  }

  await userRepo.assignRole(userId, roleId, pg)

  return true
}

const role = (parent, _args, ctx) => {
  return ctx.loaders.role.load(parent.roleId)
}

export default {
  Query: {
    hasUsers,
    myself,
    users,
  },
  Mutation: {
    assignRole,
    changePassword,
    changeUserPassword,
    initialSignUp,
    invitationSignUp,
    invite,
    removeUser,
    signInLocal,
    signOut,
  },
  User: {
    role,
  },
}
