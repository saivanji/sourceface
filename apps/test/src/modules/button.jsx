import React from "react";
// import { Setting } from "../editor/settings";
import { useSettingCallback } from "../engine";

export const Root = ({ settings: [text] }) => {
  const onClick = useSettingCallback("event");

  return (
    <button
      onClick={onClick}
      className="text-md p-2 rounded bg-gray-200 border border-gray-400 shadow"
    >
      {text || "Click me"}
    </button>
  );
};

Root.settings = ["text"];

// export function Settings() {
//   return (
//     <>
//       <Setting name="content" />
//     </>
//   );
// }
