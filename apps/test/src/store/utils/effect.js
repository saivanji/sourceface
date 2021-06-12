export const execSetting = async ([moduleId, field], getAsync, set, scope) => {
  // const module = await getAsync(moduleFamily(moduleId));
  // const { entities } = await getAsync(page);

  // const stages = getStages(field, "default", module.stages, entities);

  // console.log(stages)

  // // TODO: add Break try/catch logic

  // for (let stage of stages) {
  //   const input = stage.values.reduce((acc, valueId) => {
  //     const value = entities.values[valueId];

  //     return { ...acc, [value.name]: value };
  //   }, {});

  //   const curriedEvaluate = curry(evaluate)({ get, set }, __, scope);

  //   stagesStock[stage.type].execute(curriedEvaluate, input);
  // }
}
