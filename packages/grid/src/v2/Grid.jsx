import React, { useState, useEffect, useRef, useCallback } from "react";
import { Provider } from "../lib";
import { useApply } from "./hooks";
import Lines from "./Lines";
import Active from "./Active";
import Awaiting from "./Awaiting";
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
  const [change, setChange] = useState(false);
  const containerRef = useRef();
  const info = useApply(utils.toInfo, [cols, rows, containerWidth, rowHeight]);
  const onChangeStart = useCallback(id => setChange({ id }), []);
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
        {!!change && <Lines info={info} />}
        {React.Children.map(children, element => {
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
    </Provider>
  );
}

const BoxProvider = ({
  id,
  layout,
  info,
  children,
  change,
  components,
  onChange,
  onChangeStart,
  onChangeEnd
}) => {
  const coords = layout[id];

  const dragPreviewRef = useRef();
  const bounds = useApply(utils.toBounds, [coords, info]);

  const onChangeStartHandler = useCallback(
    payload => {
      onChangeStart(id);
      return {
        initialLayout: layout,
        initialBounds: bounds,
        coords
      };
    },
    [id, layout, coords, bounds, onChangeStart]
  );
  const onChangeHandler = useCallback(
    ({ initialLayout, initialBounds, coords }, { deltaX, deltaY }) => {
      const nextBounds = utils.drag(initialBounds, deltaX, deltaY);
      const nextCoords = utils.toCoords(nextBounds, info);

      if (utils.coordsEqual(coords, nextCoords)) return;

      onChange(utils.put(id, nextCoords, initialLayout));

      return {
        coords: nextCoords
      };
    },
    [id, info, onChange]
  );

  return change?.id === id ? (
    <Active
      dragPreviewRef={dragPreviewRef}
      changeType={change.type}
      bounds={bounds}
      components={components}
    >
      {children}
    </Active>
  ) : (
    <Awaiting
      bounds={bounds}
      dragPreviewRef={dragPreviewRef}
      onChange={onChangeHandler}
      onChangeStart={onChangeStartHandler}
      onChangeEnd={onChangeEnd}
      components={components}
    >
      {children}
    </Awaiting>
  );
};
