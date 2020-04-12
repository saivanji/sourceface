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
  const user = await pg.oneOrNone(sql.users.one, [username])
  const valid = await bcrypt.compare(password, user.password)

  if (!user || !valid) throw new Error("Username or password is invalid")

  session.userId = user.id

  return user
}

export default {
  // Query: {
  //   myself: () => (),
  // },
  Mutation: {
    signUp,
    signInLocal,
  },
}
