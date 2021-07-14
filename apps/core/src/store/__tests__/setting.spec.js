import { init } from "../fakes";

it("should return module setting config field", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("text");
  const module = fakes.entities.addModule("text", {
    config: { content: "some text" },
  });

  const callback = jest.fn();
  const store = createStore();
  store.data.setting(module.id, "content").subscribe(callback);
  expect(callback).toBeCalledWith("some text");
});

it("should return module initial setting config field", () => {
  const { fakes, createStore } = init();

  fakes.stock
    .addDefinition("text")
    .addInitialConfig({ content: "default value" });
  const module = fakes.entities.addModule("text");

  const callback = jest.fn();
  const store = createStore();
  store.data.setting(module.id, "content").subscribe(callback);
  expect(callback).toBeCalledWith("default value");
});

it("should throw an error if unrecognized stage type provided", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("text");
  const stage = fakes.entities.addStage("wrong");
  const module = fakes.entities.addModule("text", {
    fields: { content: [stage.id] },
  });

  const callback = jest.fn();
  const store = createStore();
  store.data.setting(module.id, "content").subscribe(jest.fn, callback);
  expect(callback).toBeCalledWith(new Error("Unrecognized stage type"));
});

it("should compute constant variable value", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("text");
  const value = fakes.entities.addConstantVariable("foo");
  const stage = fakes.entities.addValueStage(value.id);
  const module = fakes.entities.addModule("text", {
    fields: { content: [stage.id] },
  });

  const callback = jest.fn();
  const store = createStore();
  store.data.setting(module.id, "content").subscribe(callback);
  expect(callback).toBeCalledWith("foo");
});

it("should compute attribute variable value", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("text");
  fakes.stock.addDefinition("input").addAttribute("value", () => "some text");

  const refModule = fakes.entities.addModule("input");
  const value = fakes.entities.addAttributeVariable(refModule.id, "value");
  const stage = fakes.entities.addValueStage(value.id);
  const module = fakes.entities.addModule("text", {
    fields: { content: [stage.id] },
  });

  const callback = jest.fn();
  const store = createStore();
  store.data.setting(module.id, "content").subscribe(callback);
  expect(callback).toBeCalledWith("some text");
});

it("should compute stage variable value", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("text");
  const constantValue = fakes.entities.addConstantVariable("foo");
  const stageValue = fakes.entities.addStageVariable("stage_1");
  const stage1 = fakes.entities.addValueStage(constantValue.id, 0);
  const stage2 = fakes.entities.addValueStage(stageValue.id, 1);
  const module = fakes.entities.addModule("text", {
    fields: { content: [stage1.id, stage2.id] },
  });

  const callback = jest.fn();
  const store = createStore();
  store.data.setting(module.id, "content").subscribe(callback);
  expect(callback).toBeCalledWith("foo");
});

it("should compute input variable value", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("text");
  const value = fakes.entities.addInputVariable(["x"]);
  const stage = fakes.entities.addValueStage(value.id);
  const module = fakes.entities.addModule("text", {
    fields: { content: [stage.id] },
  });

  const callback = jest.fn();
  const store = createStore();
  store.data
    .setting(module.id, "content", { input: { x: 8 } })
    .subscribe(callback);
  expect(callback).toBeCalledWith(8);
});

it("should compute future function value", (done) => {
  const { fakes, createStore } = init();

  const identify = () => 3;
  const execute = (_args, references) => {
    if (references.operations.root === 7) {
      return { data: true };
    }
  };

  fakes.stock.addDefinition("text");
  fakes.futures.addFuture("operation", identify, execute);

  const value = fakes.entities.addFutureFunction("operation", undefined, {
    operations: { root: 7 },
  });
  const stage = fakes.entities.addValueStage(value.id);
  const module = fakes.entities.addModule("text", {
    fields: { content: [stage.id] },
  });

  const store = createStore();
  store.data.setting(module.id, "content").subscribe((value) => {
    expect(value).toBe(true);
    done();
  });
});

it("should compute future function value with args", (done) => {
  const { fakes, createStore } = init();

  const identify = () => 3;
  const execute = (args, references) => {
    if (args.content === "foo" && references.operations.root === 7) {
      return { data: true };
    }
  };

  fakes.stock.addDefinition("text");
  fakes.futures.addFuture("operation", identify, execute);

  const content = fakes.entities.addConstantVariable("foo");
  const value = fakes.entities.addFutureFunction(
    "operation",
    { content: content.id },
    {
      operations: { root: 7 },
    }
  );

  const stage = fakes.entities.addValueStage(value.id);
  const module = fakes.entities.addModule("text", {
    fields: { content: [stage.id] },
  });

  const store = createStore();
  store.data.setting(module.id, "content").subscribe((value) => {
    expect(value).toBe(true);
    done();
  });
});

it("should not need to execute future function if the same future is executing at the same time", async () => {
  const { fakes, createStore } = init();

  const callback = jest.fn();

  const identify = () => 3;
  const execute = (_args, references) => {
    if (references.operations.root === 7) {
      callback();

      return { data: true };
    }
  };

  fakes.stock.addDefinition("text");
  fakes.futures.addFuture("operation", identify, execute);

  const value1 = fakes.entities.addFutureFunction("operation", undefined, {
    operations: { root: 7 },
  });
  const stage1 = fakes.entities.addValueStage(value1.id);
  const module1 = fakes.entities.addModule("text", {
    fields: { content: [stage1.id] },
  });

  const value2 = fakes.entities.addFutureFunction("operation", undefined, {
    operations: { root: 7 },
  });
  const stage2 = fakes.entities.addValueStage(value2.id);
  const module2 = fakes.entities.addModule("text", {
    fields: { content: [stage2.id] },
  });

  const store = createStore();

  const first = new Promise((resolve) => {
    store.data.setting(module1.id, "content").subscribe(resolve);
  });

  const second = new Promise((resolve) => {
    store.data.setting(module2.id, "content").subscribe(resolve);
  });

  await Promise.all([first, second]);

  expect(callback).toBeCalledTimes(1);
});

// it("should compute method function value", () => {
//   const { fakes, createStore } = init();

//   const call = () => {}

//   fakes.stock.addDefinition("input").addMethod("reveal", call, )
// })

it("should throw an error when value is not found in registry", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("text");
  const stage = fakes.entities.addValueStage(5);
  const module = fakes.entities.addModule("text", {
    fields: { content: [stage.id] },
  });

  const callback = jest.fn();
  const store = createStore();
  store.data.setting(module.id, "content").subscribe(jest.fn, callback);
  expect(callback).toBeCalledWith(new Error("Can not find value in registry"));
});

it("should throw an error when unrecognized value category supplied", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("text");
  const value = fakes.entities.addValue("wrong");
  const stage = fakes.entities.addValueStage(value.id);
  const module = fakes.entities.addModule("text", {
    fields: { content: [stage.id] },
  });

  const callback = jest.fn();
  const store = createStore();
  store.data.setting(module.id, "content").subscribe(jest.fn, callback);
  return expect(callback).toBeCalledWith(
    new Error("Unrecognized value category")
  );
});

it("should not compute the same setting twice or more times", () => {
  const { fakes, createStore } = init();

  const callback = jest.fn();
  const config = {
    get content() {
      callback();
      return "some text";
    },
  };

  fakes.stock.addDefinition("text");
  const module = fakes.entities.addModule("text", {
    config,
  });

  const store = createStore();
  store.data.setting(module.id, "content").subscribe(jest.fn);
  store.data.setting(module.id, "content").subscribe(jest.fn);

  expect(callback).toBeCalledTimes(1);
});
