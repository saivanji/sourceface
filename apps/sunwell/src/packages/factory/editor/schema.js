import { schema } from "normalizr"
import { identify } from "../reference"

export const module = new schema.Entity("modules")
export const operation = new schema.Entity("operations")
export const page = new schema.Entity("pages")
export const reference = new schema.Entity(
  "references",
  {
    pages: [page],
    operations: [operation],
    modules: [module],
  },
  {
    idAttribute: (value, parent) => identify(parent.id, value.field),
  }
)
export const action = new schema.Entity("actions", {
  references: [reference],
})

/**
 * Defining circular dependencies
 */
module.define({ actions: [action] })

export default [module]
