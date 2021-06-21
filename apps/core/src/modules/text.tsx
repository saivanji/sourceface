import { useSetting } from "../store";
import type { TextModule } from "../types";

export const Root = () => {
  const content = useSetting<TextModule>("content");

  return <span className="text-lg">{content}</span>;
};
