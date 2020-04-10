import { graphql, faker } from "./utils"

const mutations = {
  signUp: `
    mutation($username: String!, $email: String!, $password: String!) {
      signUp(username: $username, email: $email, password: $password) {
        user {
          id
          createdAt
          username
          email
        }
        token
      }
    }
  `,
}

test("signs up a user", async () => {
  const input = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
  const {
    data: {
      signUp: { user },
    },
  } = await graphql(mutations.signUp, input)

  expect(typeof user.id).toBe("number")
  expect(typeof user.createdAt).toBe("string")

  expect(user.username).toBe(input.username)
  expect(user.email).toBe(input.email)
})

test("returns a token on sign up", async () => {
  const input = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
  const {
    data: {
      signUp: { token },
    },
  } = await graphql(mutations.signUp, input)

  expect(typeof token).toBe("string")
})

test("prevents duplicated usernames from signing up")

test("prevents duplicated emails from signing up")

test("prevents authenticated users from signing up")

test("validates username on sign up")

test("validates email on sign up")

test("validates password on sign up")
