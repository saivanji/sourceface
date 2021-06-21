import { useSetting } from "../store";

export const Root = () => {
  const content = useSetting("content");

  return <span className="text-lg">{content}</span>;
};
