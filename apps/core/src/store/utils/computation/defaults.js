/**
 * Provides default options used in computation of setting and attribute.
 */
export function defaultOpts(opts) {
  return {
    pure: opts?.pure || false,
    forceComputation: opts?.forceComputation || false,
  };
}
