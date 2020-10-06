import { SchemaDirectiveVisitor } from "graphql-tools"

export default class extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve } = field

    field.resolve = async (...args) => {
      const [, , context] = args

      if (!context.session.userId) {
        throw new Error(
          "You have to be authenticated in order to perform that action"
        )
      }

      return await resolve.apply(this, args)
    }
  }
}
