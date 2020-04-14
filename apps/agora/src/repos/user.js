import bcrypt from "bcryptjs"

export const create = async ({ username, email, password }, roleId, pg) => {
  try {
    const hash = await hashPassword(password)
    const user = await pg.one(sql.create, [username, email, hash, roleId])

    return user
  } catch (err) {
    if (err.constraint === "users_email_key") {
      throw new Error("User with such email already exists")
    }

    if (err.constraint === "users_username_key") {
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

export const changePassword = async (
  { oldPassword, newPassword },
  userId,
  pg
) => {
  return await pg.task(async (t) => {
    const user = await t.one(sql.byId, [userId])
    const valid = await validatePassword(oldPassword, user.password)

    if (!valid) throw new Error("Wrong old password")

    const hash = await hashPassword(newPassword)
    await t.none(sql.setPassword, [user.id, hash])
  })
}

export const setPassword = async (password, userId, pg) => {
  const hash = await hashPassword(password)
  await pg.none(sql.setPassword, [userId, hash])
}

export const list = async (limit, offset, pg) =>
  pg.manyOrNone(sql.list, [limit, offset])

export const remove = async (userId, pg) => pg.none(sql.remove, [userId])

export const assignRole = async (userId, roleId, pg) =>
  pg.none(sql.assignRole, [userId, roleId])

const hashPassword = (password) => bcrypt.hash(password, 10)

const validatePassword = (password, hash) => bcrypt.compare(password, hash)

const sql = {
  assignRole: `
    UPDATE users SET role_id = $2
    WHERE id = $1
  `,
  byId: `
    SELECT * FROM users WHERE id = $1;
  `,
  byUsername: `
    SELECT * FROM users WHERE username = $1;
  `,
  setPassword: `
    UPDATE users SET password = $2
    WHERE id = $1
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
  remove: `
    DELETE FROM users
    WHERE id = $1
  `,
}
