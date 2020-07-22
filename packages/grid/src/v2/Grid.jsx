import React, { useState, useEffect, useRef, useCallback } from "react";
import { Provider, useDrag } from "../lib";
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
  const onChangeStart = useCallback(
    (id, type, layout, anchor) => setChange({ id, type, layout, anchor }),
    []
  );
  const onChangeWrap = useCallback(
    coords => onChange(utils.put(change.id, coords, change.layout)),
    [change, onChange]
  );
  const onChangeEnd = useCallback(() => setChange(null), []);

  useEffect(() => {
    setContainerWidth(containerRef.current.offsetWidth);
  }, []);

  // drop target is only needed for adding items to the grid from the outside
  return (
    <Provider>
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
              onChange={onChangeWrap}
              onChangeStart={onChangeStart}
              onChangeEnd={onChangeEnd}
              components={components}
            >
              {element}
            </BoxProvider>
          );
        })}
      </div>
    </Provider>
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

  const [dragRef, dragPreviewStyle] = useDraggable(id, layout, change, info, {
    onMove: onChange,
    onStart: onChangeStart,
    onEnd: onChangeEnd
  });

  return (
    <Box
      dragRef={dragRef}
      style={style}
      previewStyle={dragPreviewStyle}
      isDragging={isDragging}
      components={components}
    >
      {children}
    </Box>
  );
};

const useDraggable = (id, layout, change, info, { onMove, onStart, onEnd }) => {
  const coords = layout[id];
  const bounds = useApply(utils.toBounds, [coords, info]);
  const [previewStyle, setPreviewStyle] = useState(null);

  const onStartWrap = useCallback(() => {
    onStart(id, "drag", layout, bounds);
    return {
      coords
    };
  }, [id, layout, bounds, coords, onStart]);

  const onMoveWrap = useCallback(
    ({ coords: prevCoords }, { deltaX, deltaY }) => {
      // TODO: fix
      if (!change) return;

      const bounds = utils.drag(change.anchor, deltaX, deltaY);
      const coords = utils.toCoords(bounds, info);
      setPreviewStyle(utils.toBoxCSS(bounds));

      if (utils.coordsEqual(prevCoords, coords)) return;

      onMove(coords);

      return {
        coords
      };
    },
    [change, info, onMove]
  );

  const ref = useDrag("box", {
    onMove: onMoveWrap,
    onStart: onStartWrap,
    onEnd
  });

  return [ref, previewStyle];
};

// const useResizable = () => {
//   return [nwRef, swRef, neRef, seRef, previewStyle];
// };
