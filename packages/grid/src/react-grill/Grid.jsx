import React, { useState, useEffect, useRef, useCallback } from "react";
import { ShiftedProvider, useDrag } from "../react-shifted";
import { useApply } from "./hooks";
import Lines from "./Lines";
import Box from "./Box";
import * as utils from "./utils";

export default function Grid({
  cols,
  rows,
  rowHeight,
  layout,
  children,
  onChange,
  components = {}
}) {
  const [containerWidth, setContainerWidth] = useState();
  const [change, setChange] = useState(null);
  const containerRef = useRef();
  const info = useApply(utils.toInfo, [cols, rows, containerWidth, rowHeight]);
  const onChangeStart = useCallback((id, type) => setChange({ id, type }), []);
  const onChangeEnd = useCallback(() => setChange(null), []);

  useEffect(() => {
    setContainerWidth(containerRef.current.offsetWidth);
  }, []);

  // drop target is only needed for adding items to the grid from the outside
  return (
    <ShiftedProvider>
      <div
        ref={containerRef}
        style={{ position: "relative", height: info.containerHeight }}
      >
        {change && <Lines info={info} />}
        {React.Children.map(children, element => {
          if (!containerWidth) {
            return (
              <Box
                style={utils.toPercentageCSS(layout[element.key], info)}
                components={components}
              >
                {element}
              </Box>
            );
          }

          return (
            <BoxProvider
              key={element.key}
              id={element.key}
              layout={layout}
              info={info}
              change={change}
              onChange={onChange}
              onChangeStart={onChangeStart}
              onChangeEnd={onChangeEnd}
              components={components}
            >
              {element}
            </BoxProvider>
          );
        })}
      </div>
    </ShiftedProvider>
  );
}

const BoxProvider = ({
  children,
  id,
  layout,
  info,
  change,
  components,
  onChange,
  onChangeStart,
  onChangeEnd
}) => {
  const style = useApply(utils.toBoxCSS, utils.toBounds, [layout[id], info]);
  const isDragging = change?.type === "drag" && change?.id === id;
  const isResizing = change?.type === "resize" && change?.id === id;

  const [dragRef, dragPreviewStyle] = useDraggable(id, layout, info, {
    onMove: onChange,
    onStart: onChangeStart,
    onEnd: onChangeEnd
  });

  const [nwRef, swRef, neRef, seRef, resizePreviewStyle] = useResizable(
    id,
    layout,
    info,
    {
      onMove: onChange,
      onStart: onChangeStart,
      onEnd: onChangeEnd
    }
  );

  return (
    <Box
      nwRef={nwRef}
      swRef={swRef}
      neRef={neRef}
      seRef={seRef}
      dragRef={dragRef}
      style={style}
      dragPreviewStyle={dragPreviewStyle}
      resizePreviewStyle={resizePreviewStyle}
      isDragging={isDragging}
      isResizing={isResizing}
      components={components}
    >
      {children}
    </Box>
  );
};

const useDraggable = (id, layout, info, { onMove, onStart, onEnd }) => {
  const coords = layout[id];
  const bounds = useApply(utils.toBounds, [coords, info]);
  const [previewStyle, setPreviewStyle] = useState(utils.toBoxCSS(bounds));

  const onStartWrap = useCallback(
    start("drag", id, layout, coords, bounds, onStart),
    [id, layout, coords, bounds, onStart]
  );

  const onMoveWrap = useCallback(
    move(utils.drag, id, info, onMove, setPreviewStyle),
    [id, info, onMove]
  );

  const ref = useDrag("box", {
    onMove: onMoveWrap,
    onStart: onStartWrap,
    onEnd
  });

  return [ref, previewStyle];
};

const useResizable = (id, layout, info, { onMove, onStart, onEnd }) => {
  const coords = layout[id];
  const bounds = useApply(utils.toBounds, [coords, info]);
  const [previewStyle, setPreviewStyle] = useState(utils.toBoxCSS(bounds));

  const onStartWrap = useCallback(
    start("resize", id, layout, coords, bounds, onStart),
    [id, layout, coords, bounds, onStart]
  );

  const onNwMoveWrap = useResizeMove("nw", id, info, onMove, setPreviewStyle);
  const onSwMoveWrap = useResizeMove("sw", id, info, onMove, setPreviewStyle);
  const onNeMoveWrap = useResizeMove("ne", id, info, onMove, setPreviewStyle);
  const onSeMoveWrap = useResizeMove("se", id, info, onMove, setPreviewStyle);

  const nwRef = useDrag("angle", {
    onMove: onNwMoveWrap,
    onStart: onStartWrap,
    onEnd
  });

  const swRef = useDrag("angle", {
    onMove: onSwMoveWrap,
    onStart: onStartWrap,
    onEnd
  });

  const neRef = useDrag("angle", {
    onMove: onNeMoveWrap,
    onStart: onStartWrap,
    onEnd
  });

  const seRef = useDrag("angle", {
    onMove: onSeMoveWrap,
    onStart: onStartWrap,
    onEnd
  });

  return [nwRef, swRef, neRef, seRef, previewStyle];
};

const useResizeMove = (angle, id, info, onMove, setPreviewStyle) =>
  useCallback(
    move(
      (...args) => utils.resize(angle, ...args),
      id,
      info,
      onMove,
      setPreviewStyle
    ),
    [id, info, onMove]
  );

const start = (type, id, layout, coords, bounds, onStart) => () => {
  onStart(id, type);
  return {
    coords,
    initial: layout,
    anchor: bounds
  };
};

const move = (fn, id, info, onMove, setPreviewStyle) => (
  { coords: prevCoords, initial, anchor },
  { deltaX, deltaY }
) => {
  const nextBounds = fn(deltaX, deltaY, anchor, info);
  const nextCoords = utils.toCoords(nextBounds, info);
  setPreviewStyle(utils.toBoxCSS(nextBounds));

  if (utils.coordsEqual(prevCoords, nextCoords)) return;

  onMove(utils.put(id, nextCoords, initial));

  return {
    coords: nextCoords
  };
};
