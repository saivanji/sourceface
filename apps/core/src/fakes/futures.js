export default class FakeFutures {
  constructor() {
    this.futures = {};
  }

  contents() {
    return this.futures;
  }

  addFuture(kind, identify, execute) {
    this.futures[kind] = {
      identify,
      execute: (args, references) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(execute(args, references));
          }, 100);
        });
      },
    };
  }
}
