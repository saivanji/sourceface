import { schema } from "normalizr";

/**
 * By a very strange reason having local "module" variable name leads to
 * application crash.
 */
const module_ = new schema.Entity("modules");

export default [module_];
