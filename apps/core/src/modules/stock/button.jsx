import { useSetting, useSettingCallback } from "../../store";

export const Root = () => {
  const text = useSetting("text");
  const onClick = useSettingCallback("click");

  return (
    <button
      onClick={onClick}
      className="text-md p-2 rounded bg-gray-200 border border-gray-400 shadow"
    >
      {text}
    </button>
  );
};
