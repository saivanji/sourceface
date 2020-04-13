import bcrypt from "bcryptjs"
import * as sql from "postgres/sql"
import * as constraints from "postgres/constraints"

export const create = async ({ username, email, password }, roleId, pg) => {
  try {
    const hash = await hashPassword(password)
    const user = await pg.one(sql.users.create, [username, email, hash, roleId])

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

export const checkPassword = async ({ username, password }, pg) => {
  const user = await pg.oneOrNone(sql.users.byUsername, [username])
  const valid = await validatePassword(password, user.password)

  if (!user || !valid) throw new Error("Username or password is invalid")

  return user
}

export const getById = async (id, pg) => {
  return await pg.oneOrNone(sql.users.byId, [id])
}

export const hasUsers = async (pg) => {
  const count = +(await pg.one(sql.users.count)).count

  return count !== 0
}

export const changePassword = async ({ oldPassword, newPassword }, id, pg) => {
  return await pg.task(async (t) => {
    const user = await t.one(sql.users.byId, [id])
    const valid = await validatePassword(oldPassword, user.password)

    if (!valid) throw new Error("Wrong old password")

    const hash = await hashPassword(newPassword)
    await t.one(sql.users.changePassword, [user.id, hash])
  })
}

export const list = async (limit, offset, pg) =>
  pg.manyOrNone(sql.users.list, [limit, offset])

const hashPassword = (password) => bcrypt.hash(password, 10)

const validatePassword = (password, hash) => bcrypt.compare(password, hash)
