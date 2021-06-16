import { chain, sort, keys, identity } from "ramda";
import { stageEntityFamily, valueEntityFamily } from "./entities";
import { valueFamily } from "./readable";

export const populateStages = (
  field,
  sequenceName,
  stageIds,
  { get, entities }
) => {
  const items = stageIds.reduce((acc, stageId) => {
    const stage = get?.(stageEntityFamily(stageId)) || entities.stages[stageId];

    if (stage.group !== `${field}/${sequenceName}`) {
      return acc;
    }

    return [...acc, stage];
  }, []);

  return sort((a, b) => a.order - b.order, items);
};

export const populateValues = (valueIds, { get, entities, fn = identity }) =>
  valueIds.reduce((acc, valueId) => {
    const value = get?.(valueEntityFamily(valueId)) || entities.values[valueId];

    return {
      ...acc,
      [value.name]: fn(value),
    };
  }, {});

export const evaluateValues = (valueIds, moduleId, field, { get }) =>
  populateValues(valueIds, {
    get,
    fn: (value) => get(valueFamily([moduleId, field, value.id])),
  });

export const getPrevStages = (valueId, stages, entities, getStageData) => {
  let result = {};

  for (let stage of stages) {
    const valuesOfArgs = chain(
      (valueId) => entities.values[valueId].args,
      stage.values
    );
    const isCurrentStage = [...valuesOfArgs, ...stage.values].includes(valueId);

    if (isCurrentStage) {
      return result;
    }

    result[stage.name] = getStageData(stage.id);
  }
};

export const transformValue = (value) => {
  const [type, category] = parseCategory(value.category);

  return {
    ...value,
    type,
    category,
    references: value.references.reduce((acc, { name, ...reference }) => {
      const type = keys(reference)[0];

      return {
        ...acc,
        [name]: reference[type],
      };
    }, {}),
  };
};

const parseCategory = (category) => category.split("/");

export class WireResult {
  constructor(data, staleIds) {
    this.data = data;
    this.staleIds = staleIds;
  }
}
