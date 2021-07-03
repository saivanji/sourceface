import * as slices from "../../slices";
import { getModuleType, getAtom, getAttribute } from "../../selectors";
import { mapAsync, pipe, all } from "../common";
import { defaultOpts } from "./defaults";
import computeSetting from "./computeSetting";

/**
 * Applies attribute selector of a specific module. Computes dependent
 * settings if they're not found in state. When computation is async,
 * then function will return a Promise.
 */
export default function computeAttribute(moduleId, key, { deps, opts, scope }) {
  opts = defaultOpts(opts);

  /**
   * Returning cached data if it exists unless "forceComputation"
   * is specified.
   */
  const cached = getAttribute(deps.state, [moduleId, key]);

  // TODO: should consider staleness same way is done in setting?
  if (!opts.forceComputation && cached) {
    return cached;
  }

  const moduleType = getModuleType(deps.state, moduleId);
  const {
    selector,
    attributes = [],
    settings = [],
    atoms = [],
  } = deps.stock[moduleType].attributes[key];

  const resultAttributes = mapAsync(
    (key) => computeAttribute(moduleId, key, { deps, opts, scope }),
    attributes
  );

  const resultSettings = mapAsync(
    (field) => computeSetting(moduleId, field, { deps, opts, scope }),
    settings
  );

  const resultAtoms = atoms.map((key) => getAtom(deps.state, [moduleId, key]));

  return pipe(
    all(
      [resultSettings, resultAttributes],
      ([resultSettings, resultAttributes]) =>
        selector({
          atoms: resultAtoms,
          settings: resultSettings,
          attributes: resultAttributes,
        })
    ),
    (data) => {
      /**
       * When not in pure mode and dispatch is supplied - populating attributes
       * state with new data.
       */
      if (deps.dispatch && !opts.pure) {
        deps.dispatch(
          slices.attributes.actions.populate({
            moduleId,
            key,
            data,
          })
        );
      }

      return data;
    }
  );
}
