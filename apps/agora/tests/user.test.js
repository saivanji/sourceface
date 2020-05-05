import * as R from "ramda"
import { graphql, faker } from "./utils"

// tests should be written without touching the database using graphql requests only

const mutations = {
  signUp: `
    mutation($username: String!, $email: String!, $password: String!) {
      signUp(username: $username, email: $email, password: $password) {
        id
        createdAt
        username
        email
      }
    }
  `,
  signInLocal: `
    mutation($username: String!, $password: String!) {
      signInLocal(username: $username, password: $password) {
        id
        createdAt
        username
        email
      }
    }
  `,
}

describe("signUp", () => {
  test("signs up a user", async () => {
    const input = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
    const {
      data: { signUp: user },
    } = await graphql(mutations.signUp, input)

    expect(typeof user.id).toBe("number")
    expect(typeof user.createdAt).toBe("string")

    expect(user.username).toBe(input.username)
    expect(user.email).toBe(input.email)
  })

  test("sends session id cookie during sign up", async () => {
    const input = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
    const { headers } = await graphql(mutations.signUp, input)

    expect(
      headers["set-cookie"].some(
        R.test(/^connect\.sid=.+;\sExpires=.+;\sHttpOnly$/)
      )
    ).toBeTruthy()
  })

  test.todo("prevents duplicated usernames from signing up")

  test.todo("prevents duplicated emails from signing up")

  test.todo("prevents authenticated users from signing up")

  test.todo("validates username on sign up")

  test.todo("validates email on sign up")

  test.todo("validates password on sign up")
})

describe("signInLocal", () => {
  test("signs in a user via username", test.todo)
})
