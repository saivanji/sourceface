import { schema } from "normalizr";

const valueSchema = new schema.Entity("values");
const stageSchema = new schema.Entity("stages", {
  values: [valueSchema],
});
const moduleSchema = new schema.Entity("modules", {
  stages: [stageSchema],
});
const rootSchema = new schema.Array(moduleSchema);

export default rootSchema;
