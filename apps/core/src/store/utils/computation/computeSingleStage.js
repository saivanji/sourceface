import { getStage } from "../../selectors";
// import { mapObjectAsync } from "../common";
import computeValue from "./computeValue";

/**
 * Computes specific stage data
 */
export default function computeSingleStage(stageId, { deps, opts, scope }) {
  const state = deps.store.getState();
  const stage = getStage(state, stageId);

  if (stage.type === "value") {
    const valueId = stage.values.root;
    return computeValue(valueId, { deps, opts, scope });
  }

  // if (stage.type === "dictionary") {
  //   return mapObjectAsync((valueId) => {
  //     return computeValue(valueId, { deps, opts, scope });
  //   }, stage.values);
  // }
}
