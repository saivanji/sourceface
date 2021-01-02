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
    type: "text",
    settings: {
      content: {
        name: "query",
        variables: {
          endpoint: { category: "global", payload: { name: "page" } },
          key: { category: "constant", payload: { value: "content" } },
        },
      },
    },
  },
  {
    id: 2,
    type: "text",
    settings: {
      content: {
        name: "query",
        variables: {
          endpoint: { category: "global", payload: { name: "page" } },
          key: { category: "constant", payload: { value: "email" } },
        },
      },
    },
  },
  {
    id: 3,
    type: "counter",
    settings: {
      postfix: {
        name: "query",
        variables: {
          endpoint: { category: "constant", payload: { value: "meta" } },
          key: { category: "constant", payload: { value: "units" } },
        },
      },
      // title: {}
    },
  },
  {
    id: 4,
    type: "text",
    settings: {
      content: {
        name: "value",
        variables: {
          input: {
            category: "scope",
            payload: {
              moduleId: 3,
              property: "formatted",
            },
          },
        },
      },
    },
  },
];
