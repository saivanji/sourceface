import { useSetting, useAttribute, useAtom } from "../store";

export function Root() {
  const placeholder = useSetting("placeholder");
  const value = useAttribute("value");
  const [error] = useAtom("error");
  // const [isRevealed] = useAtom("isRevealed")

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
