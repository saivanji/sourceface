import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import "./index.css";

const width = 1;
const height = 1;
const rowHeight = 80;
const rows = 10; // infinite?
const cols = 8;

function Grid() {
  const [{ x, y }, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setDragging] = useState(false);
  const container = useRef();
  const target = useRef({ x, y });

  return (
    <>
      <div
        onDragOver={e => {
          const { x, y } = target.current;
          const hoverX = calcX(
            e.pageX - container.current.element.offsetLeft,
            cols,
            container.current.width
          );
          const hoverY = calcY(
            e.pageY - container.current.element.offsetTop,
            rowHeight
          );

          if (hoverX === x && hoverY === y) return;

          target.current.x = hoverX;
          target.current.y = hoverY;

          setPosition({ x: hoverX, y: hoverY });
        }}
        ref={element => {
          if (!container.current && element) {
            const { width, height } = element.getBoundingClientRect();
            container.current = { width, height, element };
          }
        }}
        style={{ position: "relative", height: 500 }}
      >
        <div
          draggable
          onDragStart={() => setDragging(true)}
          onDragEnd={() => setDragging(false)}
          style={{
            transition: "transform .15s ease-out",
            position: "absolute",
            zIndex: 1,
            backgroundColor: "darkcyan",
            height: calcYCSS(height, rowHeight),
            ...(!container.current
              ? {
                  width: calcXCSSPercentage(width, cols),
                  top: calcYCSS(y, rowHeight),
                  left: calcXCSSPercentage(x, cols)
                }
              : {
                  width: calcXCSS(width, cols, container.current.width),
                  transform: `translate(${calcXCSS(
                    x,
                    cols,
                    container.current.width
                  )}px, ${calcYCSS(y, rowHeight)}px)`
                })
          }}
        />
        {isDragging && container.current && (
          <div
            style={{ position: "absolute", top: 0, left: 0 }}
            dangerouslySetInnerHTML={{
              __html: makeSvgGrid(
                rows,
                cols,
                rowHeight,
                container.current.width
              )
            }}
          />
        )}
      </div>
    </>
  );
}

const calcX = (leftOffset, columns, containerWidth) =>
  Math.floor(leftOffset / (containerWidth / columns));

const calcY = (topOffset, rowHeight) => Math.floor(topOffset / rowHeight);

const calcXCSSPercentage = (width, columns) => toPercentsCSS(width / columns);

const calcXCSS = (width, columns, containerWidth) =>
  containerWidth * (width / columns);

const calcYCSS = (height, rowHeight) => height * rowHeight;

const toPercentsCSS = n => `${n * 100}%`;

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
                `
            <line
              x1="${i * colWidth}"
              y1="0"
              x2="${i * colWidth}"
              y2="${containerHeight}"
              style="stroke: skyblue; stroke-width: 1"
            />
            `,
          ""
        )}
      ${Array(rows)
        .fill()
        .reduce(
          (acc, item, i) =>
            i === 0
              ? acc
              : acc +
                `
            <line
              x1="0"
              y1="${i * rowHeight}"
              x2="${containerWidth}"
              y2="${i * rowHeight}"
              style="stroke: skyblue; stroke-width: 1"
            />
            `,
          ""
        )}
    </svg>
  `;
};

// TODO:
// Consider source boundaries while drag
// Move element only when half area was hovered
// Draw svg grid

ReactDOM.render(<Grid />, document.getElementById("root"));
