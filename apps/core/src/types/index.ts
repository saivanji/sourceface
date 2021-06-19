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
  references: [];
  path?: [];
};

export type Variable = ConstantVariable;

export type Value = Variable;

/**
 * Utility types
 */

export type Override<T1, T2> = Omit<T1, keyof T2> & T2;
