import { stock as modulesStock } from "./modules";

export type Module = {
  id: number;
  position: number;
  type: keyof typeof modulesStock;
  stages: Stage[];
  config: {
    content?: string;
  };
  parentId?: number;
};

export type Stage = {
  id: number;
  order: number;
  name: string;
  group: string;
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
