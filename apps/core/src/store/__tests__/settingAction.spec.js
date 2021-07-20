import { init } from "../fakes";

it("should return Promise if computation is async", async () => {
  const { fakes, createStore } = init();

  const identify = (references) => references.operations.root;
  const execute = (_args, references) => {
    if (references.operations.root === 7) {
      return { data: true };
    }
  };

  fakes.stock.addDefinition("text");
  fakes.futures.addFuture("operation", identify, execute);

  const value = fakes.entities.addFutureFunction(
    "write",
    "operation",
    undefined,
    {
      operations: { root: 7 },
    }
  );
  const stage = fakes.entities.addValueStage(value.id);
  const module = fakes.entities.addModule("text", {
    fields: { content: [stage.id] },
  });

  const store = createStore();
  const result = await store.actions.setting(module.id, "content");
  expect(result).toBe(true);
});

it("should reject Promise if there was an error", async () => {
  const { fakes, createStore } = init();

  const identify = (references) => references.operations.root;
  const execute = () => {
    throw new Error("foo");
  };

  fakes.stock.addDefinition("text");
  fakes.futures.addFuture("operation", identify, execute);

  const value = fakes.entities.addFutureFunction(
    "write",
    "operation",
    undefined,
    {
      operations: { root: 7 },
    }
  );
  const stage = fakes.entities.addValueStage(value.id);
  const module = fakes.entities.addModule("text", {
    fields: { content: [stage.id] },
  });

  const store = createStore();
  const result = store.actions.setting(module.id, "content");
  await expect(result).rejects.toEqual(new Error("foo"));
});
