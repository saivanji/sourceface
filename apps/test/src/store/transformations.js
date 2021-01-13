import { keys, sort } from "ramda";
import { denormalize } from "normalizr";
import { module_ } from "./schema";

/**
 * Denormalization of module sequence data out of flat normalized shape based on
 * desired setting field and sequence name.
 */
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

/**
 * Transforming local scope entity into consistent value data
 * structure.
 *
 * References are used as a dependencies needed for further value evaluation.
 */
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

/**
 * Transforming references in the object containing reference identifier name
 * as keys and reference entry data as value.
 */
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
