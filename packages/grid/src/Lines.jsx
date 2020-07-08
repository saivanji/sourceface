import React from "react";

export default function Lines({
  rows,
  cols,
  rowHeight,
  containerWidth,
  style
}) {
  return (
    <div
      style={style}
      dangerouslySetInnerHTML={{
        __html: makeSvgGrid(rows, cols, rowHeight, containerWidth)
      }}
    />
  );
}

const makeSvgGrid = (rows, cols, rowHeight, containerWidth) => {
  const colWidth = containerWidth / cols;
  const containerHeight = rows * rowHeight;

  return `
    <svg width="${containerWidth}" height="${rowHeight * rows}">
      ${Array(cols)
        .fill()
        .reduce(
          (acc, item, i) =>
            i === 0
              ? acc
              : acc +
                renderLine(i * colWidth, 0, i * colWidth, containerHeight),
          ""
        )}
      ${Array(rows)
        .fill()
        .reduce(
          (acc, item, i) =>
            i === 0
              ? acc
              : acc +
                renderLine(0, i * rowHeight, containerWidth, i * rowHeight),
          ""
        )}
    </svg>
  `;
};

const renderLine = (x1, y1, x2, y2) => `
  <line
    x1="${x1}"
    y1="${y1}"
    x2="${x2}"
    y2="${y2}"
    style="stroke: skyblue; stroke-width: 1"
  />
`;
