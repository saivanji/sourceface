import { GraphQLScalarType } from "graphql"
import { keys, difference } from "ramda"
import { Kind } from "graphql/language"

export default new GraphQLScalarType({
  name: "Position",
  description: "Layout position",
  parseValue: ensure,
  serialize: ensure,
  parseLiteral(ast) {
    if (ast.kind === Kind.OBJECT) {
      return JSON.parse(ast.value)
    }
    return null
  },
})

// Type is the following:
// {
//   id: Int!
//   x: Int!
//   y: Int!
//   w: Int!
//   h: Int!
// }
const ensure = value => {
  if (typeof value !== "object" || value instanceof Array) {
    throw new TypeError("Position should have object type")
  }

  const fields = ["id", "x", "y", "w", "h"]

  const diff = difference(keys(value), fields)

  if (diff.length) {
    throw new TypeError(`Position can not have ${diff.join(",")} fields`)
  }

  for (let field of fields) {
    if (!value[field]) {
      throw new TypeError(`Position ${field} is required`)
    }

    if (typeof value[field] !== "number") {
      throw new TypeError(`Position ${field} should have integer type`)
    }
  }

  return value
}
