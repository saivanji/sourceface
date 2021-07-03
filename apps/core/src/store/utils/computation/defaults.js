export function defaultOpts(opts) {
  return {
    pure: opts?.pure || false,
    forceComputation: opts?.forceComputation || false,
  };
}
