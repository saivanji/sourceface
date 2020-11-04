import * as normalizr from "normalizr"

const layout = new normalizr.schema.Entity("layouts")
const action = new normalizr.schema.Entity("actions")
const module = new normalizr.schema.Entity("modules", { actions: [action] })

const schema = {
  layout,
  modules: [module],
}

export const normalize = (page) => normalizr.normalize(page, schema)
export const denormalize = (result, entities) =>
  normalizr.denormalize(result, schema, entities)
