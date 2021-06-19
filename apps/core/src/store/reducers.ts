import type { Module, Stage, Value, Override } from "../types";

export type State = {
  moduleIds: Result;
  entities: Entities;
  indexes: Indexes;
  computations: Computations;
};

export type Entities = {
  modules: Record<Module["id"], NormalizedModule>;
  stages: Record<Stage["id"], NormalizedStage>;
  values: Record<Value["id"], Value>;
};

export type Indexes = {
  stages: {
    /**
     * "key" essentialy is a Module["id"]. Due to TS restriction, we can not
     * use type aliases as index signature parameters.
     */
    [moduleId: number]: {
      [field: string]: Stage["id"][];
    };
  };
  values: {
    [stageId: number]: {
      [name: string]: Value["id"];
    };
  };
};

export type Computations = {
  [moduleId: number]: {
    [field: string]: unknown;
  };
};

export type Result = Module["id"][];

export type NormalizedModule = Override<
  Module,
  {
    stages: Stage["id"][];
  }
>;
export type NormalizedStage = Override<
  Stage,
  {
    values: Value["id"][];
  }
>;

export default function rootReducer(
  state: State = {
    moduleIds: [],
    entities: { modules: {}, stages: {}, values: {} },
    indexes: {
      stages: {},
      values: {},
    },
    computations: {},
  }
) {
  return state;
}
