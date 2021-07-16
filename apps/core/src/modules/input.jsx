import {
  useSetting,
  useAttribute,
  useAtom,
  useUpdateAtoms,
  Interruption,
} from "../core";

export function Root() {
  const placeholder = useSetting("placeholder");
  const value = useAttribute("value");
  const update = useUpdateAtoms();
  const [error] = useAtom("error");

  const change = (e) => {
    const { value } = e.target;

    update((prev) => ({
      error: !prev.revealed ? null : validate(value),
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
    call: (_args, { updateAtoms, attributes: [value] }) => {
      const error = validate(value);

      if (error) {
        updateAtoms({ error, revealed: true });
        throw new Interruption(`Validation failed - ${error}`);
      }

      updateAtoms({ revealed: true });
      return value;
    },
    attributes: ["value"],
  },
};

const regexp = /^.+$/;
const validate = (value) => {
  if (regexp.test(value)) {
    return null;
  }

  return "Invalid input";
};
