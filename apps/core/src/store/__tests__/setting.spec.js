import { Interruption } from "../";
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
  store.data.setting(module.id, "content").subscribe(jest.fn(), callback);
  expect(callback).toBeCalledWith(new Error("Unrecognized stage type"));
});

it("should compute every value of dictionary stage regardless interruption", () => {
  const { fakes, createStore } = init();

  const callback = jest.fn();

  fakes.stock.addDefinition("text");
  fakes.stock.addDefinition("input").addAttribute("value", () => {
    callback();
    throw new Interruption();
  });

  const input1 = fakes.entities.addModule("input");
  const input2 = fakes.entities.addModule("input");

  const value1 = fakes.entities.addAttributeVariable(input1.id, "value");
  const value2 = fakes.entities.addAttributeVariable(input2.id, "value");
  const stage = fakes.entities.addDictionaryStage({
    x: value1.id,
    y: value2.id,
  });
  const module = fakes.entities.addModule("text", {
    fields: { content: [stage.id] },
  });

  const store = createStore();
  const errorCallback = jest.fn();
  store.data.setting(module.id, "content").subscribe(jest.fn(), errorCallback);
  expect(callback).toBeCalledTimes(2);
  expect(errorCallback.mock.calls[0][0]).toBeInstanceOf(Interruption);
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

it("should compute mount variable value", (done) => {
  const { fakes, createStore } = init();

  const identify = (references) => references.operations.root;
  const execute = () => {
    return { data: "foobar" };
  };

  fakes.stock.addDefinition("container");
  fakes.stock.addDefinition("text");
  fakes.futures.addFuture("operation", identify, execute);

  const containerValue = fakes.entities.addFutureFunction(
    "operation",
    undefined,
    {
      operations: { root: 7 },
    }
  );
  const containerStage = fakes.entities.addValueStage(containerValue.id);
  const container = fakes.entities.addModule("container", {
    fields: { "@mount": [containerStage.id] },
  });

  const value = fakes.entities.addMountVariable(container.id);
  const stage = fakes.entities.addValueStage(value.id);
  const module = fakes.entities.addModule("text", {
    fields: { content: [stage.id] },
  });

  const store = createStore();
  store.data.setting(module.id, "content").subscribe((data) => {
    expect(data).toBe("foobar");
    done();
  });
});

it("should compute future function value", (done) => {
  const { fakes, createStore } = init();

  const identify = (references) => references.operations.root;
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

  const identify = (references) => references.operations.root;
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

it("should invalidate computed future function value after another future executed", (done) => {
  const { fakes, createStore } = init();
  let db = ["Alice"];

  const identify = (references) => references.operations.root;
  const execute = (_args, references) => {
    if (references.operations.root === 7) {
      return { data: db };
    }

    if (references.operations.root === 9) {
      db.push("Bob");
      return { stale: [7] };
    }
  };

  fakes.stock.addDefinition("table");
  fakes.futures.addFuture("operation", identify, execute);

  const users = fakes.entities.addFutureFunction("operation", undefined, {
    operations: { root: 7 },
  });
  const tableStage = fakes.entities.addValueStage(users.id);
  const table = fakes.entities.addModule("table", {
    fields: { items: [tableStage.id] },
  });

  const createUser = fakes.entities.addFutureFunction("operation", undefined, {
    operations: { root: 9 },
  });
  const buttonStage = fakes.entities.addValueStage(createUser.id);
  const button = fakes.entities.addModule("table", {
    fields: { event: [buttonStage.id] },
  });

  const store = createStore();

  let i = 0;
  store.data.setting(table.id, "items").subscribe((data) => {
    i++;

    if (i === 1) {
      store.data.setting(button.id, "event").subscribe().unsubscribe();
      return;
    }

    expect(data).toEqual(["Alice", "Bob"]);
    done();
  });
});

it("should invalidate specific future data in cache after ttl timeout expired", async () => {
  const { fakes, createStore } = init();

  const callback = jest.fn();

  const identify = (references) => references.operations.root;
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

  const store = createStore({ futuresTTL: 1 });

  await new Promise((resolve) => {
    store.data.setting(module1.id, "content").subscribe(resolve);
  });

  await new Promise((resolve) => setTimeout(() => resolve(), 100));

  await new Promise((resolve) => {
    store.data.setting(module2.id, "content").subscribe(resolve);
  });

  expect(callback).toBeCalledTimes(2);
});

it("should execute multiple futures at the same time with different arguments supplied", async () => {
  const { fakes, createStore } = init();

  const identify = (references) => references.operations.root;
  const execute = (args, references) => {
    if (references.operations.root === 7) {
      return { data: args.x };
    }
  };

  fakes.stock.addDefinition("text");
  fakes.futures.addFuture("operation", identify, execute);

  const constant1 = fakes.entities.addConstantVariable("foo");
  const value1 = fakes.entities.addFutureFunction(
    "operation",
    { x: constant1.id },
    {
      operations: { root: 7 },
    }
  );
  const stage1 = fakes.entities.addValueStage(value1.id);
  const module1 = fakes.entities.addModule("text", {
    fields: { content: [stage1.id] },
  });

  const constant2 = fakes.entities.addConstantVariable("bar");
  const value2 = fakes.entities.addFutureFunction(
    "operation",
    { x: constant2.id },
    {
      operations: { root: 7 },
    }
  );
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

  const result = await Promise.all([first, second]);
  expect(result).toEqual(["foo", "bar"]);
});

it("should not need to execute future function if the same future is executing at the same time", async () => {
  const { fakes, createStore } = init();

  const callback = jest.fn();

  const identify = (references) => references.operations.root;
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

it("should compute method function value", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("text");
  fakes.stock
    .addDefinition("input")
    .addMethod("reveal", (args) => args.prefix + "bar");

  const refModule = fakes.entities.addModule("input");
  const constant = fakes.entities.addConstantVariable("foo");
  const value = fakes.entities.addMethodFunction(refModule.id, "reveal", {
    prefix: constant.id,
  });
  const stage = fakes.entities.addValueStage(value.id);
  const module = fakes.entities.addModule("text", {
    fields: { content: [stage.id] },
  });

  const callback = jest.fn();
  const store = createStore();
  store.data.setting(module.id, "content").subscribe(callback);
  expect(callback).toBeCalledWith("foobar");
});

it("should throw an error when value is not found in registry", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("text");
  const stage = fakes.entities.addValueStage(5);
  const module = fakes.entities.addModule("text", {
    fields: { content: [stage.id] },
  });

  const callback = jest.fn();
  const store = createStore();
  store.data.setting(module.id, "content").subscribe(jest.fn(), callback);
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
  store.data.setting(module.id, "content").subscribe(jest.fn(), callback);
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

it("should compute dictionary stage type", () => {
  const { fakes, createStore } = init();

  fakes.stock.addDefinition("text");
  const value1 = fakes.entities.addConstantVariable("foo");
  const value2 = fakes.entities.addConstantVariable("bar");
  const value3 = fakes.entities.addConstantVariable("baz");
  const stage = fakes.entities.addDictionaryStage({
    x: value1.id,
    y: value2.id,
    z: value3.id,
  });
  const module = fakes.entities.addModule("text", {
    fields: { content: [stage.id] },
  });

  const callback = jest.fn();
  const store = createStore();
  store.data.setting(module.id, "content").subscribe(callback);
  expect(callback).toBeCalledWith({
    x: "foo",
    y: "bar",
    z: "baz",
  });
});
