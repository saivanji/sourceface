/**
 * Provides default options used in computation of setting and attribute.
 */
export function defaultOpts(opts) {
  return {
    forceComputation: opts?.forceComputation || false,
  };
}
