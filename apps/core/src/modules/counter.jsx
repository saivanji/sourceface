import { useStateValue } from "../store";

export function Root() {
  const [value, setValue] = useStateValue("value");

  return (
    <div className="flex flex-col items-center">
      <span className="mb-2">Current: {value}</span>
      <div className="grid grid-flow-col gap-2">
        <button
          className="px-2 border border-gray-400 bg-gray-200 shadow rounded"
          onClick={() => setValue(value - 1)}
        >
          -
        </button>
        <button
          className="px-2 border border-gray-400 bg-gray-200 shadow rounded"
          onClick={() => setValue(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

export const initialState = {
  value: 0,
};

export const initialConfig = {};
