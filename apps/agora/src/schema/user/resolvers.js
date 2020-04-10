import bcrypt from "bcryptjs"
import * as sql from "sql/index"

const signUp = async (parent, { username, email, password }, { pg }) => {
  const hash = await bcrypt.hash(password, 10)
  const user = await pg.one(sql.users.create, [username, email, hash])

  return {
    user,
    token: "test",
  }
}

export default {
  // Query: {
  //   myself: () => (),
  // },
  Mutation: {
    signUp,
  },
}
