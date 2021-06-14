export function listModules() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(modules);
    }, Math.random() * 1000);
  });
}

// TODO: should modules have name? default "module_{n}"
// TODO: names for stages. default "stage_{n}"
export const modules = [
  {
    id: 49275,
    position: 0,
    parentId: null,
    type: "button",
    config: {
      text: "Create order",
    },
    stages: [
      {
        id: 2428,
        order: 0,
        name: "stage_1",
        group: "event/default",
        type: "value",
        values: [
          {
            id: 2358,
            name: "root",
            category: "function/module",
            payload: {
              property: "open",
            },
            args: [],
            references: [
              {
                name: "module",
                module: {
                  id: 823,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 1,
    position: 1,
    parentId: null,
    type: "table",
    config: {
      limit: 10,
    },
    stages: [
      {
        id: 2952,
        name: "stage_1",
        order: 0,
        group: "data/default",
        type: "value",
        values: [
          {
            id: 40284,
            name: "root",
            category: "variable/constant",
            payload: {
              value: "foo",
            },
            references: [],
          },
        ],
      },
      {
        id: 1,
        name: "stage_2",
        order: 1,
        group: "data/default",
        type: "value",
        values: [
          {
            id: 1,
            name: "root",
            category: "function/operation",
            args: [
              {
                id: 2,
                name: "limit",
                category: "variable/module",
                payload: { property: "limit" },
                references: [
                  {
                    name: "module",
                    module: {
                      id: 1,
                    },
                  },
                ],
              },
              {
                id: 3,
                name: "offset",
                category: "variable/module",
                payload: { property: "offset" },
                references: [
                  {
                    name: "module",
                    module: {
                      id: 1,
                    },
                  },
                ],
              },
            ],
            references: [
              {
                name: "root",
                operation: {
                  id: 1,
                  name: "ordersList",
                  stale: [],
                },
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: "stage_1",
        order: 0,
        group: "page/default",
        type: "value",
        values: [
          {
            id: 4,
            name: "root",
            category: "variable/module",
            payload: {
              property: "value",
            },
            references: [
              {
                name: "module",
                module: {
                  id: 3,
                },
              },
            ],
          },
        ],
      },
      {
        id: 15,
        name: "stage_1",
        order: 0,
        group: "remove/default",
        type: "value",
        values: [
          {
            id: 5,
            name: "root",
            category: "function/operation",
            args: [
              {
                id: 6,
                name: "id",
                category: "variable/argument",
                payload: { property: "id" },
                references: [],
              },
            ],
            references: [
              {
                name: "root",
                operation: {
                  id: 3,
                  name: "removeOrder",
                  stale: [{ id: 1 }],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    parentId: null,
    position: 2,
    type: "text",
    stages: [
      {
        id: 3,
        name: "stage_1",
        order: 0,
        group: "content/default",
        type: "value",
        values: [
          {
            id: 7,
            name: "root",
            category: "variable/module",
            payload: {
              property: "value",
            },
            references: [
              {
                name: "module",
                module: {
                  id: 5,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    position: 3,
    parentId: null,
    type: "counter",
    stages: [],
  },
  {
    id: 5,
    position: 0,
    parentId: 7,
    type: "input",
    stages: [
      {
        id: 10,
        name: "stage_1",
        order: 0,
        group: "initial/default",
        type: "value",
        values: [
          {
            id: 8,
            name: "root",
            category: "variable/mount",
            path: ["customer_name"],
            references: [
              {
                name: "module",
                module: {
                  id: 7,
                },
              },
            ],
          },
        ],
      },
    ],
    config: {
      placeholder: "Enter customer name",
    },
  },
  {
    id: 6,
    position: 1,
    parentId: 7,
    type: "input",
    stages: [
      {
        id: 18,
        name: "stage_1",
        order: 0,
        group: "initial/default",
        type: "value",
        values: [
          {
            id: 9,
            name: "root",
            category: "variable/mount",
            path: ["address"],
            references: [
              {
                name: "module",
                module: {
                  id: 7,
                },
              },
            ],
          },
        ],
      },
    ],
    config: {
      placeholder: "Enter address",
    },
  },
  {
    id: 4,
    position: 2,
    parentId: 7,
    type: "button",
    config: {
      text: "Submit",
    },
    stages: [
      {
        id: 5,
        order: 0,
        name: "form_data",
        group: "event/default",
        type: "dictionary",
        values: [
          {
            id: 10,
            name: "customer_name",
            category: "function/module",
            payload: {
              property: "reveal",
            },
            args: [],
            references: [
              {
                name: "module",
                module: {
                  id: 5,
                },
              },
            ],
          },
          {
            id: 11,
            name: "address",
            category: "function/module",
            payload: {
              property: "reveal",
            },
            args: [],
            references: [
              {
                name: "module",
                module: {
                  id: 6,
                },
              },
            ],
          },
        ],
      },
      {
        id: 2242,
        order: 1,
        name: "stage_2",
        group: "event/default",
        type: "value",
        values: [
          {
            id: 4295,
            name: "root",
            category: "function/operation",
            dict_args: [],
            args: [
              {
                id: 9245,
                name: "id",
                category: "variable/module",
                payload: { property: "selected" },
                references: [
                  {
                    name: "module",
                    module: { id: 1 },
                  },
                ],
              },
              // TODO: implement passing "form_data" dictionary as spread so we don't need to specify the fields
              // separately
              {
                id: 5284,
                name: "customer_name",
                category: "variable/stage",
                payload: { name: "form_data" },
                path: ["customer_name"],
                references: [],
              },
              {
                id: 5823,
                name: "address",
                category: "variable/stage",
                payload: { name: "form_data" },
                path: ["address"],
                references: [],
              },
            ],
            references: [
              {
                name: "root",
                operation: {
                  id: 83,
                  name: "updateOrder",
                  stale: [{ id: 1 }],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 7,
    position: 4,
    parentId: null,
    type: "container",
    stages: [
      {
        id: 6,
        name: "stage_1",
        order: 0,
        group: "@mount/default",
        type: "value",
        values: [
          {
            id: 12,
            name: "root",
            category: "function/operation",
            args: [
              {
                id: 13,
                name: "id",
                category: "variable/module",
                payload: { property: "selected" },
                references: [
                  {
                    name: "module",
                    module: {
                      id: 1,
                    },
                  },
                ],
              },
            ],
            references: [
              {
                name: "root",
                operation: {
                  id: 2,
                  name: "order",
                  stale: [],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 823,
    position: null,
    parentId: null,
    type: "modal",
    config: { title: "Create order" },
    stages: [],
  },
  //
  {
    id: 8420,
    position: 0,
    parentId: 823,
    type: "input",
    stages: [],
    config: {
      placeholder: "Enter customer name",
    },
  },
  {
    id: 84024,
    position: 1,
    parentId: 823,
    type: "input",
    stages: [],
    config: {
      placeholder: "Enter address",
    },
  },
  {
    id: 24892,
    position: 2,
    parentId: 823,
    type: "button",
    config: {
      text: "Submit",
    },
    stages: [
      {
        id: 4928,
        order: 0,
        name: "form_data",
        group: "event/default",
        type: "dictionary",
        values: [
          {
            id: 194,
            name: "customer_name",
            category: "function/module",
            payload: {
              property: "reveal",
            },
            args: [],
            references: [
              {
                name: "module",
                module: {
                  id: 8420,
                },
              },
            ],
          },
          {
            id: 149,
            name: "address",
            category: "function/module",
            payload: {
              property: "reveal",
            },
            args: [],
            references: [
              {
                name: "module",
                module: {
                  id: 84024,
                },
              },
            ],
          },
        ],
      },
      {
        id: 7238,
        order: 1,
        name: "stage_2",
        group: "event/default",
        type: "value",
        values: [
          {
            id: 1042,
            name: "root",
            category: "function/operation",
            dict_args: [],
            args: [
              {
                id: 1035,
                name: "customer_name",
                category: "variable/stage",
                payload: { name: "form_data" },
                path: ["customer_name"],
                references: [],
              },
              {
                id: 75245,
                name: "address",
                category: "variable/stage",
                payload: { name: "form_data" },
                path: ["address"],
                references: [],
              },
            ],
            references: [
              {
                name: "root",
                operation: {
                  id: 95,
                  name: "createOrder",
                  stale: [{ id: 1 }],
                },
              },
            ],
          },
        ],
      },
      {
        id: 85402,
        order: 2,
        name: "stage_3",
        group: "event/default",
        type: "value",
        values: [
          {
            id: 45278,
            name: "root",
            category: "function/module",
            payload: {
              property: "close",
            },
            args: [],
            references: [
              {
                name: "module",
                module: {
                  id: 823,
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

// Postgres tables are:
// "values" - id, stage_id, name, category
// "values_arguments" value_id, arg_value_id
// "references" - "value_id", "..."
// "stages" - id, parent_id, type, config, group, order
//
// Make sure that we update value with a transaction by deleting previous variable/function and setting
// a new one in order not to have both variable and function available at the same name. The same goes for references

// Graphql types are - Stage, Variable, Function, Reference
// const stages = [
//   {
//     id: 1,
//     order: 0,
//     group: "data/default",
//     type: "value",
//     functions: [],
//     variables: [
//       {
//         name: "root",
//         category: "constant",
//         payload: {
//           value: "foo",
//         },
//       },
//     ],
//   },
//   {
//     id: 2,
//     order: 1,
//     group: "data/default",
//     type: "value",
//     functions: [
//       {
//         name: "root",
//         category: "operation",
//         references: [
//           {
//             name: "root",
//             operation: {
//               id: 1,
//               "...": "...",
//             },
//           },
//         ],
//         args: [
//           {
//             name: "foo",
//             category: "constant",
//             payload: { value: "bar" },
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 3,
//     order: 2,
//     group: "data/default",
//     type: "list",
//     variables: [
//       {
//         name: "index/1",
//         category: "constant",
//         payload: { value: "bar" },
//       },
//       {
//         name: "index/2",
//         category: "module",
//         payload: { name: "page" },
//         references: [
//           {
//             name: "root",
//             module: {
//               id: 1,
//               "...": "...",
//             },
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: 4,
//     order: 3,
//     group: "data/default",
//     type: "script",
//     config: { value: "console.log('foo bar')" },
//   },
//   {
//     id: 5,
//     order: 4,
//     group: "data/default",
//     type: "catch",
//     name: "foo",
//     // TODO: in graphql request send all stages for all fields in one array, then construct appropriate data
//     // based on stage parent_id and group.
//     stages: [
//       {
//         id: 6,
//         order: 1,
//         group: "success",
//         type: "value",
//         variables: ["..."],
//       },
//       {
//         id: 7,
//         order: 2,
//         group: "success",
//         type: "value",
//         variables: ["..."],
//       },
//       {
//         id: 8,
//         order: 1,
//         group: "failure",
//         type: "value",
//         variables: ["..."],
//       },
//     ],
//   },
//   {
//     id: 9,
//     order: 1,
//     group: "page/default",
//     type: "cond",
//     stages: [
//       {
//         id: 10,
//         order: 1,
//         group: "case/0",
//         type: "value",
//         variables: ["..."],
//       },
//     ],
//     variables: [
//       {
//         name: "root",
//         "...": "...",
//       },
//       {
//         name: "case/0",
//         "...": "...",
//       },
//     ],
//   },
//   {
//     id: 11,
//     order: 2,
//     group: "page/default",
//     type: "loop",
//     functions: [
//       {
//         name: "action",
//         "...": "...",
//       },
//     ],
//     variables: [
//       {
//         name: "root",
//         "...": "...",
//       },
//     ],
//   },
//   {
//     id: 12,
//     order: 3,
//     group: "page/default",
//     type: "effect",
//     functions: [
//       {
//         effect: true,
//         name: "root",
//         "...": "...",
//       },
//     ],
//   },
// ];
