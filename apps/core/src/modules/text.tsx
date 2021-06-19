import { useSetting } from "../store";

export const Root = () => {
  const content = useSetting<string>("content");

  return <span className="text-lg">{content}</span>;
};
