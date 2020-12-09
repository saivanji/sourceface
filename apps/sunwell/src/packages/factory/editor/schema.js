import { schema } from "normalizr"

const createReference = (source, name) =>
  new schema.Entity(
    name + "_references",
    {
      one: source,
      many: [source],
    },
    {
      idAttribute: (value, parent) => `action/${parent.id}/${value.field}`,
    }
  )

export const module = new schema.Entity("modules")
export const command = new schema.Entity("commands")
export const page = new schema.Entity("pages")
export const action = new schema.Entity("actions", {
  pagesRefs: [createReference(page, "pages")],
  operationsRefs: [createReference(command, "operations")],
  modulesRefs: [createReference(module, "modules")],
})

/**
 * Defining circular dependencies
 */
module.define({ actions: [action] })

export default [module]
