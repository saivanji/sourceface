import { schema } from "normalizr"
import { identify } from "../reference"

const createReference = (source, name) =>
  new schema.Entity(
    name + "_references",
    {
      one: source,
      many: [source],
    },
    {
      idAttribute: (value, parent) => identify(parent.id, value.field),
    }
  )

// export const createActionRefId = () =>

export const module = new schema.Entity("modules")
export const operation = new schema.Entity("operations")
export const page = new schema.Entity("pages")
export const action = new schema.Entity("actions", {
  pagesRefs: [createReference(page, "pages")],
  operationsRefs: [createReference(operation, "operations")],
  modulesRefs: [createReference(module, "modules")],
})

/**
 * Defining circular dependencies
 */
module.define({ actions: [action] })

export default [module]
