import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as utils from "./utils";
import Item from "./Item";
import Lines from "./Lines";
import Grid from "./Grid";

const items = [
  {
    id: "john",
    text: "John",
    color: "darkCyan"
  }
];

const layout = {
  john: {
    x: 1,
    y: 2,
    height: 3,
    width: 2
  }
};

// Definition:
// Drag preview - either original dimmed appearance, static placeholder image or colored bg (persisting dimensions) or generic card with static size. Most likely will have static size card with type of module
// When drag preview reaches more than half of a cell - move it there
// When dragging keep original dimensions of a dragging element in a placeholder regardless how drag preview will look like

// TODO:
// Implement drag handle
//
// Consider source boundaries while drag
// Move element only when half area was hovered
//
// Have stacking and free movement at the same time

ReactDOM.render(
  <Grid rowHeight={80} rows={10} cols={8} layout={layout}>
    {items.map(item => (
      <div
        key={item.id}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: item.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem"
        }}
      >
        {item.text}
      </div>
    ))}
  </Grid>,
  document.getElementById("root")
);
