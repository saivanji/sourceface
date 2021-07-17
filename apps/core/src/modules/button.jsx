import { useSetting, useSettingCallback } from "../core";

export const Root = () => {
  const text = useSetting("text");
  const onClick = useSettingCallback("click");

  // TODO: how to leverage "useTransition" and "isPending" for displaying "loading" state
  // instead of relying on Promise result from "onClick"?

  return (
    <button
      onClick={onClick}
      className="text-md p-2 rounded bg-gray-200 border border-gray-400 shadow"
    >
      {text}
    </button>
  );
};
