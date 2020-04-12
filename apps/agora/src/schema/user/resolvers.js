import bcrypt from "bcryptjs"
import * as sql from "postgres/sql"
import * as constraints from "postgres/constraints"

const signUp = async (
  parent,
  { username, email, password },
  { pg, session }
) => {
  try {
    const hash = await bcrypt.hash(password, 10)
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
  const valid = await bcrypt.compare(password, user.password)

  if (!user || !valid) throw new Error("Username or password is invalid")

  session.userId = user.id

  return user
}

const signOut = async (parent, _args, { session }) => {
  await new Promise((resolve, reject) => {
    try {
      session.destroy(resolve)
    } catch (err) {
      reject(err)
    }
  })

  return true
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
  },
}
