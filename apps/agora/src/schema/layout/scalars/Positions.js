import { GraphQLScalarType } from "graphql"
import { toPairs, keys, difference } from "ramda"
import { Kind } from "graphql/language"

export default new GraphQLScalarType({
  name: "Positions",
  description: "Layout positions",
  parseValue: ensure,
  serialize: ensure,
  parseLiteral(ast) {
    if (ast.kind === Kind.OBJECT) {
      return JSON.parse(ast.value)
    }
    return null
  },
})

const ensure = value => {
  if (typeof value !== "object" || value instanceof Array) {
    throw new TypeError("Positions should have object type")
  }

  // value type is the following:
  // {
  //   x: Int!
  //   y: Int!
  //   w: Int!
  //   h: Int!
  // }
  for (let [key, position] of toPairs(value)) {
    const fields = ["x", "y", "w", "h"]

    const diff = difference(keys(position), fields)

    if (diff.length) {
      throw new TypeError(
        `Positions ${key} can not have ${diff.join(",")} fields`
      )
    }

    for (let field of fields) {
      if (!position[field]) {
        throw new TypeError(`Positions ${key}.${field} is required`)
      }

      if (typeof position[field] !== "number") {
        throw new TypeError(
          `Positions ${key}.${field} should have integer type`
        )
      }
    }
  }

  return value
}
