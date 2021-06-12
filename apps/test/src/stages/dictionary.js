import { mapObjIndexed, keys } from "ramda";

export const execute = (evaluate, input, isAsync) => {
  if (!isAsync) {
    return executeSync(evaluate, input);
  }

  return executeAsync(evaluate, input);
};

const executeSync = (evaluate, input) => {
  return mapObjIndexed((value) => evaluate(value), input);
};

const executeAsync = async (evaluate, input) => {
  const fields = keys(input);

  const all = await Promise.all(fields.map((key) => evaluate(input[key])));

  return all.reduce((acc, item, i) => ({ ...acc, [fields[i]]: item }), {});
};
