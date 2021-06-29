import { useSetting, useAttribute, useAtom, useBatch } from "../store";

export function Root() {
  const placeholder = useSetting("placeholder");
  const value = useAttribute("value");
  const [error, setError] = useAtom("error");
  const [, setRevealed] = useAtom("isRevealed");
  const batch = useBatch(setError, setRevealed);

  const change = (e) => {};

  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        className={error ? "bg-red-200" : ""}
        onChange={change}
      />
      {error && <div className="text-red-600 mt-1">{error}</div>}
    </div>
  );
}

export const initialConfig = {
  placeholder: "Enter text",
};

export const initialAtoms = {
  value: null,
  isRevealed: false,
  error: null,
};

export const attributes = {
  value: {
    selector: ({ atoms: [value], settings: [initial] }) =>
      value ?? initial ?? "",
    settings: ["initial"],
    atoms: ["value"],
    type: "String",
  },
};

export const methods = {};
