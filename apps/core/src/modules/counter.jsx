import { useAtom } from "../core";

export function Root() {
  const [value, setValue] = useAtom("value");

  return (
    <div className="flex flex-col items-center">
      <span className="mb-2">Current: {value}</span>
      <div className="grid grid-flow-col gap-2">
        <button
          className="px-2 border border-gray-400 bg-gray-200 shadow rounded"
          onClick={() => setValue((prev) => prev - 1)}
        >
          -
        </button>
        <button
          className="px-2 border border-gray-400 bg-gray-200 shadow rounded"
          onClick={() => setValue((prev) => prev + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

export const initialAtoms = {
  value: 0,
};

export const initialConfig = {};

export const attributes = {
  value: {
    selector: ({ atoms: [value] }) => value,
    atoms: ["value"],
    type: "Number",
  },
};
