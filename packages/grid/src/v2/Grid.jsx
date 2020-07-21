import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback
} from "react";
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
  const [isChanging, setChanging] = useState(false);
  const containerRef = useRef();
  const info = useApply(utils.toInfo, [cols, rows, containerWidth, rowHeight]);
  const onChangeStart = useCallback(id => setChanging(true), []);
  const onChangeEnd = useCallback(() => setChanging(false), []);

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
        {isChanging && <Lines info={info} />}
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
  components,
  onChange,
  onChangeStart,
  onChangeEnd
}) => {
  const coords = layout[id];

  const bounds = useApply(utils.toBounds, [coords, info]);
  const style = useApply(utils.toBoxCSS, [bounds]);

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

  const [ref, { isDragging, deltaX, deltaY }] = useDrag("box", {
    onMove: onChangeHandler,
    onStart: onChangeStartHandler,
    onEnd: onChangeEnd
  });

  const initialBounds = useMemo(() => {
    // TODO: how to run only once on drag start?
    console.log(bounds);
    return bounds;
  }, [isDragging]);
  // TODO: rename to drag preview style?
  const previewStyle = useApply(utils.drag, [initialBounds, deltaX, deltaY]);

  return (
    <Box
      ref={ref}
      style={style}
      previewStyle={previewStyle}
      isChanging={isDragging}
      components={components}
    >
      {children}
    </Box>
  );
};
