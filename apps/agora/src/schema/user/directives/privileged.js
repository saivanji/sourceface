import { SchemaDirectiveVisitor } from "graphql-tools"
import * as roleRepo from "repos/role"

export default class extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve } = field

    field.resolve = async (...args) => {
      const [, , context] = args

      const isAllowed = await roleRepo.privileged(
        context.session.userId,
        context.pg
      )

      if (!isAllowed) {
        throw new Error(
          "You need to be have a privileged role in order to perform that action"
        )
      }

      return await resolve.apply(this, args)
    }
  }
}
