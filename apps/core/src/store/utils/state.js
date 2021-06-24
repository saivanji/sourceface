export function populateModulesState(moduleIds, stock, entities) {
  return moduleIds.reduce((acc, moduleId) => {
    const module = entities.modules[moduleId];
    const { initialState } = stock[module.type];

    if (!initialState) {
      return acc;
    }

    return { ...acc, [moduleId]: initialState };
  }, {});
}
