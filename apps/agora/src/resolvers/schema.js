import * as valueRepo from "repos/value"

const schema = (parent, args, { pg }) => valueRepo.getSchema(pg)

// TODO: reject invalid schema
const setSchema = (parent, { schema }, { pg }) =>
  valueRepo.setSchema(schema, pg)

export default {
  Query: {
    schema,
  },
  Mutation: {
    setSchema,
  },
}
