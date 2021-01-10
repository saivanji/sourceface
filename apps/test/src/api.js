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
    stages: [
      {
        id: 1,
        order: 0,
        group: "content/default",
        type: "value",
        functions: [],
        variables: [
          {
            id: 1,
            name: "root",
            category: "constant",
            payload: {
              value: "Hello World",
            },
          },
        ],
      },
    ],
  },
];

const _modules = [
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

// Postgres tables are:
// "values" - id, stage_id, name
// "variables" - id, value_id, category, payload
// "functions" - id, value_id, category, is_effect
// "functions_arguments" function_id, value_id
// "references" - "value_id", "..."
// "stages" - id, parent_id, type, config, group, order
//
// Make sure that we update value with a transaction by deleting previous variable/function and setting
// a new one in order not to have both variable and function available at the same name.

// Graphql types are - Stage, Variable, Function, Reference
const stages = [
  {
    id: 1,
    order: 0,
    group: "data/default",
    type: "value",
    functions: [],
    variables: [
      {
        name: "root",
        category: "constant",
        payload: {
          value: "foo",
        },
      },
    ],
  },
  {
    id: 2,
    order: 1,
    group: "data/default",
    type: "value",
    functions: [
      {
        name: "root",
        category: "operation",
        references: [
          {
            name: "root",
            operation: {
              id: 1,
              "...": "...",
            },
          },
        ],
        arguments: [
          {
            name: "foo",
            category: "constant",
            payload: { value: "bar" },
          },
        ],
      },
    ],
  },
  {
    id: 3,
    order: 2,
    group: "data/default",
    type: "list",
    variables: [
      {
        name: "index/1",
        category: "constant",
        payload: { value: "bar" },
      },
      {
        name: "index/2",
        category: "module",
        payload: { name: "page" },
        references: [
          {
            name: "root",
            module: {
              id: 1,
              "...": "...",
            },
          },
        ],
      },
    ],
  },
  {
    id: 4,
    order: 3,
    group: "data/default",
    type: "script",
    config: { value: "console.log('foo bar')" },
  },
  {
    id: 5,
    order: 4,
    group: "data/default",
    type: "catch",
    name: "foo",
    // TODO: in graphql request send all stages for all fields in one array, then construct appropriate data
    // based on stage parent_id and group.
    stages: [
      {
        id: 6,
        order: 1,
        group: "success",
        type: "value",
        variables: ["..."],
      },
      {
        id: 7,
        order: 2,
        group: "success",
        type: "value",
        variables: ["..."],
      },
      {
        id: 8,
        order: 1,
        group: "failure",
        type: "value",
        variables: ["..."],
      },
    ],
  },
  {
    id: 9,
    order: 1,
    group: "page/default",
    type: "cond",
    stages: [
      {
        id: 10,
        order: 1,
        group: "case/0",
        type: "value",
        variables: ["..."],
      },
    ],
    variables: [
      {
        name: "root",
        "...": "...",
      },
      {
        name: "case/0",
        "...": "...",
      },
    ],
  },
  {
    id: 11,
    order: 2,
    group: "page/default",
    type: "loop",
    functions: [
      {
        name: "action",
        "...": "...",
      },
    ],
    variables: [
      {
        name: "root",
        "...": "...",
      },
    ],
  },
  {
    id: 12,
    order: 3,
    group: "page/default",
    type: "effect",
    functions: [
      {
        effect: true,
        name: "root",
        "...": "...",
      },
    ],
  },
];

const transformed = {
  default: [
    {
      id: 1,
      type: "value",
      values: {
        root: {
          type: "function",
          category: "operation",
          arguments: {
            foo: {
              category: "constant",
              payload: { value: "bar" },
            },
          },
          references: {
            root: {
              operation: {
                id: 1,
                "...": "operation entry data",
              },
            },
          },
        },
      },
    },
    {
      id: 2,
      type: "catch",
      stages: {
        success: [
          {
            id: 6,
            type: "value",
            values: {},
          },
          {
            id: 7,
            type: "value",
            values: {},
          },
        ],
        failure: [
          {
            id: 8,
            type: "value",
            values: {},
          },
        ],
      },
    },
    {
      id: 3,
      type: "cond",
      stages: {
        "case/0": {
          id: 10,
          type: "value",
          values: {},
        },
      },
      values: {
        root: {
          type: "variable",
          name: "root",
          "...": "...",
        },
        "case/0": {
          type: "variable",
          "...": "...",
        },
      },
    },
  ],
};
