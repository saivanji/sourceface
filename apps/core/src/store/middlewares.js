import * as modulesSlices from "./slices/modules";

// TODO: implement middleware for listening module state change actions and marking dependent computations as stale
export const invalidation = (store) => (next) => (action) => {
  const moduleStateChangeType = modulesSlices.state.actions.update.type;

  if (action.type === moduleStateChangeType) {
    const { moduleId, nextValue, key } = action.payload;

    // TODO: Try to implement getting the dependencies without index first.
    // TODO: Create index for keeping dependencies between modules on the external module state.

    console.log(action);
  }

  return next(action);
};
