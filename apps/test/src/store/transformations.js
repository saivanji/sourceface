import { identity, keys, sort } from "ramda";

/**
 * Denormalization of module sequence data out of flat normalized shape based on
 * desired setting field and sequence name.
 */
export const getSequence = (field, sequenceName, stageIds, getStage) => {
  const items = stageIds.reduce((acc, stageId) => {
    const stage = getStage(stageId);

    if (stage.group !== `${field}/${sequenceName}`) {
      return acc;
    }

    return [
      ...acc,
      {
        id: stage.id,
        type: stage.type,
        values: {
          ...transformValues(stage.variables, "variable"),
          ...transformValues(stage.functions, "function", (data) => ({
            ...data,
            args: transformValues(data.args, "variable"),
          })),
        },
      },
    ];
  }, []);

  return sort((a, b) => a.order - b.order, items);
};

/**
 * Transforming local scope entity into consistent value data
 * structure.
 *
 * References are used as a dependencies needed for further value evaluation.
 */
const transformValues = (items, type, mapData = identity) =>
  items.reduce(
    (acc, v) => ({
      ...acc,
      [v.name]: {
        type,
        data: mapData({
          ...v,
          references: transformReferences(v.references),
        }),
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
      [name]: reference[type],
    };
  }, {});
