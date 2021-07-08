import { isNil } from "ramda";
import * as slices from "../../slices";
import {
  getModuleType,
  getAtom,
  getAttribute,
  getAttributeDataId,
} from "../../selectors";
import { mapAsync, pipe, all } from "../common";
import { defaultOpts } from "./defaults";
import computeSetting from "./computeSetting";
import Data from "./data";

/**
 * Applies attribute selector of a specific module. Computes dependent
 * settings if they're not found in state. When computation is async,
 * then function will return a Promise.
 */
export default function computeAttribute(moduleId, key, { deps, opts, scope }) {
  opts = defaultOpts(opts);

  const state = deps.store.getState();

  /**
   * Returning cached data if it exists unless "forceComputation"
   * is specified.
   */
  const cached = getAttribute(state, [moduleId, key]);

  // TODO: should consider staleness same way is done in setting?
  if (!opts.forceComputation && !isNil(cached)) {
    const id = getAttributeDataId(state, [moduleId, key]);
    return new Data(cached, undefined, { id, deps, opts });
  }

  const moduleType = getModuleType(state, moduleId);
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

  const resultAtoms = atoms.map((key) => getAtom(state, [moduleId, key]));

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
       * Data coming from selector above might be not wrapped in Data.
       * In that case wrapping it so we have consistent type.
       */
      const nextData = !(data instanceof Data)
        ? new Data(data, undefined, { deps, opts })
        : data;

      nextData.save(slices.attributes.actions.assoc, { moduleId, key });

      return nextData;
    }
  );
}
