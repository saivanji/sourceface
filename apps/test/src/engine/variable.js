const global = {
  page: "about",
  version: "2.1.3",
};

// TODO: there will be especial syntax where user can enter * when types variable name in the "Value" component. In that case Value will return an object
// with keys as patterns. Like `form_*.value` will return object with keys as patterns and "value" fields as values
//
// The same applies to functions: `form_*.justify` will call justify functions on desired modules and return an object with results.

export const evaluate = (definition, getLocalVariable) => {
  if (definition.category === "global") {
    return global[definition.payload.name];
  }

  if (definition.category === "constant") {
    return definition.payload.value;
  }

  if (definition.category === "scope") {
    const { moduleId, property } = definition.payload;

    return getLocalVariable(moduleId, property);
  }
};
