export const normalize = (list) =>
  list.reduce(
    (acc, item) => ({
      ids: [...acc.ids, item.id],
      entity: { ...acc.entity, [item.id]: item }
    }),
    {
      ids: [],
      entity: {}
    }
  );
