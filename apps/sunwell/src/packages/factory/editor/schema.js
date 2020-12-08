import { schema } from "normalizr"

export const module = new schema.Entity("modules")
export const command = new schema.Entity("commands")
export const page = new schema.Entity("pages")
export const action = new schema.Entity("actions", {
  pagesRefs: [{ one: page, many: [page] }],
  operationsRefs: [{ one: command, many: [command] }],
  modulesRefs: [{ one: module, many: [module] }],
})

/**
 * Defining circular dependencies
 */
module.define({ actions: [action] })

export default [module]
