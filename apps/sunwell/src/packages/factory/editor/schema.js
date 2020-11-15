import { schema } from "normalizr"

export const command = new schema.Entity("commands")
export const page = new schema.Entity("pages")
export const layout = new schema.Entity("layouts")
export const action = new schema.Entity("actions", {
  commands: [command],
  pages: [page],
})
export const module = new schema.Entity("modules", { actions: [action] })

export default {
  layout,
  modules: [module],
}
