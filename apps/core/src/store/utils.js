import setWith from "lodash.setwith";

export const set = (...args) => setWith(...args, Object);

export function toPromise() {}
