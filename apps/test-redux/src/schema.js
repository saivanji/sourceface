import { normalize, schema } from "normalizr";

/**
 * By a very strange reason having local "module" variable name leads to
 * application crash.
 */
const module_ = new schema.Entity("modules");
const value = new schema.Entity("values");
const stage = new schema.Entity("stages", {
  values: [value],
});

value.define({ args: [value] });

/**
 * Defining circular dependencies
 */
module_.define({ stages: [stage] });

export default function normalizeSchema(modules) {
  return normalize(modules, [module_]);
}
