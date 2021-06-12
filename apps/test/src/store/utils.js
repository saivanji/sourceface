import { sort, keys, identity } from "ramda";

export const populateStages = (field, sequenceName, stageIds, entities) => {
  const items = stageIds.reduce((acc, stageId) => {
    const stage = entities.stages[stageId];

    if (stage.group !== `${field}/${sequenceName}`) {
      return acc;
    }

    return [...acc, stage];
  }, []);

  return sort((a, b) => a.order - b.order, items);
};

export const populateValues = (items, entities, fn = identity) =>
  items.reduce((acc, valueId) => {
    const value = entities.values[valueId];

    return {
      ...acc,
      [value.name]: fn(value),
    };
  }, {});

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
