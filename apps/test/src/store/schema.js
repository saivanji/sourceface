import { schema } from "normalizr";

/**
 * By a very strange reason having local "module" variable name leads to
 * application crash.
 */
const module_ = new schema.Entity("modules");
const stage = new schema.Entity("stages");

/**
 * Defining circular dependencies
 */
module_.define({ stages: [stage] });

export default [module_];
