import React from "react";
// import { Setting } from "../editor/settings";
import { useSettingCallback } from "../engine";

export const Root = () => {
  const onClick = useSettingCallback("event");

  return (
    <button
      onClick={onClick}
      className="text-md p-2 rounded bg-gray-200 border border-gray-400 shadow"
    >
      Click me
    </button>
  );
};

// export function Settings() {
//   return (
//     <>
//       <Setting name="content" />
//     </>
//   );
// }
