export default class FakeFutures {
  constructor() {
    this.futures = {};
  }

  contents() {
    return this.futures;
  }

  addFuture(kind, fn) {
    this.futures[kind] = (args, references) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fn(args, references));
        }, 100);
      });
    };
  }
}
