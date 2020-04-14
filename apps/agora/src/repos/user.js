import bcrypt from "bcryptjs"
import * as constraints from "postgres/constraints"

export const create = async ({ username, email, password }, roleId, pg) => {
  try {
    const hash = await hashPassword(password)
    const user = await pg.one(sql.create, [username, email, hash, roleId])

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
  const user = await pg.oneOrNone(sql.byUsername, [username])
  const valid = await validatePassword(password, user.password)

  if (!user || !valid) throw new Error("Username or password is invalid")

  return user
}

export const getById = async (id, pg) => {
  return await pg.oneOrNone(sql.byId, [id])
}

export const hasUsers = async (pg) => {
  const count = +(await pg.one(sql.count)).count

  return count !== 0
}

export const changePassword = async ({ oldPassword, newPassword }, id, pg) => {
  return await pg.task(async (t) => {
    const user = await t.one(sql.byId, [id])
    const valid = await validatePassword(oldPassword, user.password)

    if (!valid) throw new Error("Wrong old password")

    const hash = await hashPassword(newPassword)
    await t.one(sql.changePassword, [user.id, hash])
  })
}

export const list = async (limit, offset, pg) =>
  pg.manyOrNone(sql.list, [limit, offset])

const hashPassword = (password) => bcrypt.hash(password, 10)

const validatePassword = (password, hash) => bcrypt.compare(password, hash)

const sql = {
  byId: `
    SELECT * FROM users WHERE id = $1;
  `,
  byUsername: `
    SELECT * FROM users WHERE username = $1;
  `,
  changePassword: `
    UPDATE users SET password = $2
    WHERE id = $1
    RETURNING *;
  `,
  count: `
    SELECT count(id) FROM users
  `,
  create: `
    INSERT INTO users (username, email, password, role_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `,
  list: `
    SELECT * FROM users
    LIMIT $1 OFFSET $2
  `,
}
