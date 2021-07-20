import { init } from "../fakes";

it("should compute write future function value", (done) => {
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
  store.actions.setting(module.id, "content").subscribe((value) => {
    expect(value).toBe(true);
    done();
  });
});
