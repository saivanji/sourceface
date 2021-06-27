import { useSetting } from "../store";

export const Root = () => {
  const content = useSetting("content");

  return <span className="text-lg">{content}</span>;
};

export const attributes = {
  value: {
    selector: ({ settings: [content] }) => content,
    settings: ["content"],
    type: "String",
  },
};
