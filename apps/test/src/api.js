export function listModules() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(modules);
    }, Math.random() * 1000);
  });
}

// setting = "config entry || action"
export const modules = [
  {
    id: 1,
    type: "table",
    settings: {
      data: {
        type: "operation",
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
      page: {
        type: "value",
        variables: {
          input: {
            category: "scope",
            payload: { moduleId: 3, property: "value" },
          },
        },
      },
      // Using "value" action until we implement state configuration values.
      limit: {
        type: "value",
        variables: {
          input: {
            category: "constant",
            payload: { value: 10 },
          },
        },
      },
    },
  },
  {
    id: 2,
    type: "text",
    settings: {
      content: {
        type: "value",
        variables: {
          input: {
            category: "scope",
            payload: { moduleId: 1, property: "offset" },
          },
        },
      },
    },
  },
  {
    id: 3,
    type: "counter",
  },
  {
    id: 4,
    type: "button",
    settings: {
      event: {
        type: "operation",
        variables: {
          name: { category: "constant", payload: { value: "ordersList" } },
          limit: { category: "constant", payload: { value: 10 } },
          offset: { category: "constant", payload: { value: 0 } },
        },
      },
    },
  },
];
