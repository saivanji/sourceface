import util from "util"
import * as sql from "postgres/sql"
import * as constraints from "postgres/constraints"
import * as userService from "services/user"

const signUp = async (
  parent,
  { username, email, password },
  { pg, session }
) => {
  try {
    const hash = await userService.hashPassword(password)
    const user = await pg.one(sql.users.create, [username, email, hash])

    session.userId = user.id

    return user
  } catch (err) {
    if (err.constraint === constraints.USER_EMAIL_UNIQUE) {
      throw new Error("User with such email already exists")
    }

    if (err.constraint === constraints.USER_USERNAME_UNIQUE) {
      throw new Error("User with such username already exists")
    }

    throw err
  }
}

const signInLocal = async (parent, { username, password }, { pg, session }) => {
  const user = await pg.oneOrNone(sql.users.byUsername, [username])
  const valid = await userService.validatePassword(password, user.password)

  if (!user || !valid) throw new Error("Username or password is invalid")
  session.userId = user.id

  return user
}

const signOut = async (parent, _args, { session }) => {
  await util.promisify(session.destroy.bind(session))()
  return true
}

const changePassword = async (
  parent,
  { oldPassword, newPassword },
  // not using destructuring for `context`. Since pg-session deletes `session` object
  // upon calling `regenerate` and spawning a new instance afterwards.
  context
) => {
  return await context.pg.task(async (t) => {
    const user = await t.one(sql.users.byId, [context.session.userId])
    const valid = await userService.validatePassword(oldPassword, user.password)

    if (!valid) throw new Error("Wrong old password")

    const hash = await userService.hashPassword(newPassword)
    await t.one(sql.users.changePassword, [user.id, hash])

    await util.promisify(context.session.regenerate.bind(context.session))()
    context.session.userId = user.id

    return true
  })
}

const myself = async (parent, _args, { pg, session }) => {
  return await pg.oneOrNone(sql.users.byId, [session.userId])
}

export default {
  Query: {
    myself,
  },
  Mutation: {
    signUp,
    signInLocal,
    signOut,
    changePassword,
  },
}
