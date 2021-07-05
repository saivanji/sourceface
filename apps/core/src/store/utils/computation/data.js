import { isNil, path } from "ramda";
import { getNextDataId } from "../../selectors";

/**
 * Represents data of the application. It can be:
 * - any computation result
 * - operation result
 */
export default class Data {
  constructor(value, path, { id, deps, opts }) {
    this.value = value;
    this.path = path;
    this.id = id;
    this.deps = deps;
    this.opts = opts;
  }

  reveal() {
    return path(this.path || [], this.value);
  }

  assignPath(path) {
    this.path = path;

    return this;
  }

  save(createAction, info) {
    const state = this.deps.store.getState();
    const cached = !isNil(this.id);
    const id = this.id || getNextDataId(state);

    const payload = {
      info,
      id,
      path: this.path,
      data: !cached ? this.value : undefined,
    };
    this.deps.store.dispatch(createAction(payload));

    if (!cached) {
      this.id = id;
    }

    return this;
  }
}
