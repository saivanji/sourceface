import { keys, sort } from "ramda";
import { denormalize } from "normalizr";
import { module_ } from "./schema";

export const getSequence = (field, sequenceName, module, entities) => {
  const items = denormalize(module, module_, entities).stages.reduce(
    (acc, s) => {
      if (s.group !== `${field}/${sequenceName}`) {
        return acc;
      }

      return [
        ...acc,
        {
          id: s.id,
          type: s.type,
          values: {
            ...transformValues(s.variables, "variable"),
            ...transformValues(s.functions, "function"),
          },
        },
      ];
    },
    []
  );

  return sort((a, b) => a.order - b.order, items);
};

const transformValues = (items, type) =>
  items.reduce(
    (acc, v) => ({
      ...acc,
      [v.name]: {
        type,
        data: {
          ...v,
          references: transformReferences(v.references),
        },
      },
    }),
    {}
  );

const transformReferences = (items) =>
  items.reduce((acc, { name, ...reference }) => {
    const type = keys(reference)[0];

    return {
      ...acc,
      [name]: {
        data: reference[type],
      },
    };
  }, {});
