export interface BaseModule {
  id: number;
  position: number;
  stages: Stage[];
  parentId?: number;
}

export interface TextModule extends BaseModule {
  type: "text";
  config?: {
    content?: string;
  };
}

export interface CounterModule extends BaseModule {
  type: "counter";
  config?: {
    foo?: string;
  };
}

export type Module = TextModule | CounterModule;

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
    // TODO: value could be any literal type
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

export type Config = UnionToIntersection<Module["config"]>;

/**
 * Utility types
 */

export type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export type UnionToIntersection<T> = (
  T extends any ? (x: T) => any : never
) extends (x: infer R) => any
  ? R
  : never;

export type ValueOf<T> = T[keyof T];
