import React from "react";
import Item from "./Item";

export default function Grid({ children, rowHeight, rows, cols, layout }) {
  return (
    <div style={{ position: "relative", height: 500 }}>
      {React.Children.map(children, (item, i) => {
        console.log(item);
        return i;
      })}
    </div>
  );
}
