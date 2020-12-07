import { schema } from "normalizr"

export const module = new schema.Entity("modules")
export const command = new schema.Entity("commands")
export const page = new schema.Entity("pages")
export const action = new schema.Entity("actions", {
  references: {
    pages: [
      {
        data: page,
      },
    ],
    operations: [{ data: command }],
    modules: [{ data: module }],
  },
})

module.define({ actions: [action] })

export default [module]
