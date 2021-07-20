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
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              resolve(execute(args, references));
            } catch (err) {
              reject(err);
            }
          }, 100);
        });
      },
    };
  }
}
