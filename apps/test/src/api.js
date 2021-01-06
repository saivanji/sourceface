export function listModules() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(modules);
    }, Math.random() * 1000);
  });
}

export const modules = [
  {
    id: 1,
    type: "table",
    config: {
      limit: 10,
    },
    actions: [
      {
        id: 1,
        order: 0,
        type: "operation",
        field: "data",
        variables: {
          name: { category: "constant", payload: { value: "ordersList" } },
          limit: {
            category: "scope",
            payload: { moduleId: 1, property: "limit" },
          },
          offset: {
            category: "scope",
            payload: { moduleId: 1, property: "offset" },
          },
        },
      },
      {
        id: 2,
        order: 0,
        type: "value",
        field: "page",
        variables: {
          input: {
            category: "scope",
            payload: { moduleId: 3, property: "value" },
          },
        },
      },
    ],
  },
  {
    id: 2,
    type: "text",
    actions: [
      {
        id: 3,
        order: 0,
        field: "content",
        type: "value",
        variables: {
          input: {
            category: "scope",
            payload: { moduleId: 5, property: "value" },
          },
        },
      },
    ],
  },
  {
    id: 3,
    type: "counter",
  },
  {
    id: 5,
    type: "input",
  },
  {
    id: 4,
    type: "button",
    config: {
      text: "Submit",
    },
    actions: [
      {
        id: 4,
        order: 0,
        type: "operation",
        field: "event",
        variables: {
          name: { category: "constant", payload: { value: "ordersList" } },
          limit: { category: "constant", payload: { value: 10 } },
          offset: { category: "constant", payload: { value: 0 } },
        },
      },
    ],
  },
];
