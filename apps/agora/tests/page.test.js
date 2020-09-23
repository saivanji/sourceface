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

// paths:
// /orders/store/create
// /orders/store/list
// /orders/studio/create
// /orders/studio/list
// /users/store/create
// /users/store/list
// /users/studio/create
// /users/studio/list

// routes:
// /orders/store/create
// /orders/store/:action
// /orders/:section/:action
// /:entity/:section/:action
// /:entity/:section/create
// /:entity/store/create
// /orders/:section/create
// /:entity/store/:action

describe("page", () => {
  test("returns /orders/store/create page for /orders/store/create path", async () => {
    const res = await graphql(queries.page, {
      path: "/orders/store/create",
    })

    expect(res.data.page.route).toBe("/orders/store/create")
  })

  // TODO: test that it's not matching /orders/:section/list
  test("returns /orders/store/:action page for /orders/store/list path", async () => {
    const res = await graphql(queries.page, {
      path: "/orders/store/list",
    })

    expect(res.data.page.route).toBe("/orders/store/:action")
  })

  test("returns /orders/:section/create page for /orders/studio/create path", async () => {
    const res = await graphql(queries.page, {
      path: "/orders/studio/create",
    })

    expect(res.data.page.route).toBe("/orders/store/create")
  })

  test("returns /orders/:section/:action page for /orders/studio/list path", async () => {
    const res = await graphql(queries.page, {
      path: "/orders/studio/list",
    })

    expect(res.data.page.route).toBe("/orders/:section/:action")
  })

  test("returns /:entity/store/create page for /users/store/create path", async () => {
    const res = await graphql(queries.page, {
      path: "/users/store/create",
    })

    expect(res.data.page.route).toBe("/:entity/store/create")
  })

  test("returns /:entity/store/:action page for /users/store/list path", async () => {
    const res = await graphql(queries.page, {
      path: "/users/store/list",
    })

    expect(res.data.page.route).toBe("/:entity/store/:action")
  })

  test("returns /:entity/:section/create page for /users/studio/create path", async () => {
    const res = await graphql(queries.page, {
      path: "/users/studio/create",
    })

    expect(res.data.page.route).toBe("/:entity/:section/create")
  })

  test("returns /:entity/:section/:action page for /users/studio/list path", async () => {
    const res = await graphql(queries.page, {
      path: "/users/studio/list",
    })

    expect(res.data.page.route).toBe("/:entity/:section/:action")
  })
})
