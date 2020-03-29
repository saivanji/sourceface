export default {
  Query: {
    myself: () => ({
      id: 1,
      email: "aiven715@gmail.com",
      username: "aiven715",
      role: "admin",
      permissions: ["INVITE"],
    }),
  },
  Mutation: {
    invite: () => "invitation",
  },
}
