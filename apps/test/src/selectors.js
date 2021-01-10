import { sort } from "ramda";
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
            ...transformValue(s.variables, "variable"),
            ...transformValue(s.functions, "function"),
          },
        },
      ];
    },
    []
  );

  return sort((a, b) => a.order - b.order, items);
};

const transformValue = (items, type) =>
  items.reduce(
    (acc, x) => ({
      ...acc,
      [x.name]: {
        type,
        data: x,
      },
    }),
    {}
  );
