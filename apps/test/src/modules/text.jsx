import React from "react";
// import { Setting } from "../editor/settings";

export const Root = ({ settings: [content] }) => {
  return <span className="text-lg">{content}</span>;
};

Root.settings = ["content"];

// export function Settings() {
//   return (
//     <>
//       <Setting name="content" />
//     </>
//   );
// }
