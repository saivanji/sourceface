import util from "util"
import * as userRepo from "repos/user"

const signUp = async (parent, args, { pg, session }) => {
  const user = await userRepo.createUser(args, pg)
  session.userId = user.id
  return user
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
  await userRepo.changePassword(context.session.userId, args, context.pg)

  await util.promisify(context.session.regenerate.bind(context.session))()
  context.session.userId = user.id

  return true
}

const myself = async (parent, _args, { pg, session }) => {
  return await userRepo.getById(session.userId, pg)
}

const hasUsers = async (parent, _args, { pg }) => {
  return await userRepo.hasUsers(pg)
}

export default {
  Query: {
    hasUsers,
    myself,
  },
  Mutation: {
    changePassword,
    signInLocal,
    signOut,
    signUp,
  },
}
