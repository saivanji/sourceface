import type { RootProps } from "./";

export const Root = ({ settings: [content] }: RootProps<[string]>) => {
  return <span className="text-lg">{content}</span>;
};

export const rootSettings = ["content"] as const;

export type Config = {
  content: string;
};
