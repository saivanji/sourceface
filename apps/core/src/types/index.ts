export type Module = {
  id: number;
  position: number;
  type: "text";
  stages: Stage[];
  config: {
    [key: string]: unknown;
  };
  parentId?: number;
};

export type Stage = {
  id: number;
  order: number;
  name: string;
  field: string;
  type: StageType;
  values: Value[];
};

export type StageType = "value" | "dictionary" | "debug";

export type ConstantVariable = {
  id: number;
  name: string;
  category: "variable/constant";
  payload: {
    value: string;
  };
  references: References;
  path?: [];
};

export type FutureFunc = {
  id: number;
  name: string;
  category: "function/future";
  payload: {
    kind: "operation";
  };
  references: References;
  path?: [];
};

export type Variable = ConstantVariable;
export type Func = FutureFunc;

export type Value = Variable | Func;

export type Operation = {
  id: number;
  name: string;
  stale: Operation["id"][];
};

export type References = {
  operations?: {
    [key: string]: Operation["id"];
  };
};

/**
 * Utility types
 */

export type Override<T1, T2> = Omit<T1, keyof T2> & T2;
