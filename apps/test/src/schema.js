import { schema } from "normalizr";

/**
 * By a very strange reason having local "module" variable name leads to
 * application crash.
 */
const module_ = new schema.Entity("modules");
const action = new schema.Entity("actions");

/**
 * Defining circular dependencies
 */
module_.define({ actions: [action] });

export default [module_];
