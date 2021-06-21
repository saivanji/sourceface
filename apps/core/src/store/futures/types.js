export type Response<T> = {
  data: null | T;
  stale?: number[];
};
