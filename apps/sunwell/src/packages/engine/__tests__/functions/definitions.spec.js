import { evaluate } from "../../"

test("evaluates successfully function definitions without parameters", () => {
  const fn = evaluate("-> do exec x: 1, y: 2", { exec: ({ x, y }) => x + y })

  expect(typeof fn).toBe("function")
  expect(fn()).toBe(3)
})

test("evaluates successfully function definitions without parameters and extra spaces", () => {
  const fn = evaluate("   -> do exec x: 1, y: 2", { exec: ({ x, y }) => x + y })

  expect(typeof fn).toBe("function")
  expect(fn()).toBe(3)
})

test("evaluates successfully function definitions with single parameter", () => {
  const fn = evaluate("x -> do exec x, y: 2", { exec: ({ x, y }) => x + y })

  expect(typeof fn).toBe("function")
  expect(fn({ x: 3 })).toBe(5)
})

test("evaluates successfully function definitions with single parameter and extra spaces", () => {
  const fn = evaluate("    x      -> do exec x, y: 2", {
    exec: ({ x, y }) => x + y,
  })

  expect(typeof fn).toBe("function")
  expect(fn({ x: 3 })).toBe(5)
})

test("evaluates successfully function definitions with multiple parameters", () => {
  const fn = evaluate("x, y -> do exec x, y", { exec: ({ x, y }) => x + y })

  expect(typeof fn).toBe("function")
  expect(fn({ x: 3, y: 4 })).toBe(7)
})

test("evaluates successfully function definitions with multiple parameters and extra spaces", () => {
  const fn = evaluate("    x,      y       -> do exec x, y", {
    exec: ({ x, y }) => x + y,
  })

  expect(typeof fn).toBe("function")
  expect(fn({ x: 3, y: 4 })).toBe(7)
})

test("evaluates successfully function definitions with single parameter and result function fails", () => {
  const fn = evaluate("x -> do exec x, y", { exec: ({ x, y }) => [x, y] })

  expect(typeof fn).toBe("function")
  expect(() => fn({ x: 3, y: 4 })).toThrow("Variable is not defined")
})
