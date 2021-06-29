// TODO: start with tests?

export default function useBatch(...setters) {
  /**
   * Could be used in different ways:
   * - "batch({a: 1, b: 2})"
   * - "batch(prevAtoms => ({ ...prevAtoms, b: 2 }))"
   */
  return (next) => {
    const prevData = setters.reduce((acc, setter) => {
      const { key, prev } = setter(new Update());

      return {
        ...acc,
        [key]: prev,
      };
    }, {});
  };
}

export class Update {}

// /**
//  * Class representing update in a simple object format
//  */
// export class DataUpdate {
//   constructor(data) {
//     this.data = data;
//   }

//   get(key) {
//     return this.data[key];
//   }
// }

// /**
//  * Class representing update with the help of function where
//  * function input is previous data and output is next data.
//  */
// export class FunctionUpdate {
//   constructor(fn) {
//     this.fn = fn;
//   }

//   get(key, prev) {
//     return this.fn(prev)[key];
//   }
// }
