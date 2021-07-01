import { useSetting, useAttribute, useAtom, useBatch } from "../../store";

export function Root() {
  const placeholder = useSetting("placeholder");
  const value = useAttribute("value");
  const [error] = useAtom("error");
  const batch = useBatch();

  const change = (e) => {
    const { value } = e.target;

    batch(({ revealed }) => ({
      error: !revealed ? null : validate(value),
      value,
    }));
  };

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
  value: "",
  revealed: false,
  touched: false,
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

export const methods = {
  reveal: {
    call: (args, { batch, atoms, settings, attributes }) => {},
    settings: [],
    attributes: [],
    // most likely not needed since atoms can be provided directly to "call" function
    atoms: [],
  },
};

const regexp = /^.+$/;
const validate = (value) => {
  if (regexp.test(value)) {
    return null;
  }

  return "Invalid input";
};
