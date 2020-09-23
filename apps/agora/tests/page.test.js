import { graphql } from "./utils"

const queries = {
  page: `
    query($path: String!) {
      page(path: $path) {
        id
        route
      }
    }
  `,
}

describe("page", () => {
  test("returns /orders/:id page for /orders/5 path", async () => {
    const {
      data: { page },
    } = await graphql(queries.page, {
      path: "/orders/5",
    })

    expect(page.route).toBe("/orders/:id")
  })
})
