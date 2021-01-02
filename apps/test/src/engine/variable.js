const global = {
  page: "about",
  version: "2.1.3"
};

export const evaluate = (definition, getScopeValue) => {
  if (definition.category === "global") {
    return global[definition.payload.name];
  }

  if (definition.category === "constant") {
    return definition.payload.value;
  }

  if (definition.category === "scope") {
    const { moduleId, property } = definition.payload;

    return getScopeValue(moduleId, property);
  }
};
