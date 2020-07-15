import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback
} from "react";
import Lines from "./Lines";
import Box from "./Box";
import * as utils from "./utils";
import { itemContext } from "./context";

export default function Grid({
  children,
  rowHeight,
  rows,
  cols,
  layout,
  onChange,
  components = {}
}) {
  const [motion, setMotion] = useState();
  const [containerWidth, setContainerWidth] = useState(null);
  const motioning = useRef(null);
  const containerRef = useRef();

  useEffect(() => {
    // what is offsetWidth?
    setContainerWidth(containerRef.current?.offsetWidth);
  }, [containerRef]);

  const info = useMemo(
    () => utils.toInfo(cols, rows, containerWidth, rowHeight),
    [cols, rows, containerWidth, rowHeight]
  );

  const onMotionStart = useCallback(
    (id, type) => {
      motioning.current = { id, layout, initial: layout };
      setMotion(type);
    },
    [motioning, layout, setMotion]
  );

  const onMotionEnd = useCallback(() => {
    setMotion(null);
    motioning.current = null;
  }, [motioning]);

  const onMotion = useCallback(
    bounds => {
      const { id, initial, layout } = motioning.current;

      const current = layout[id];
      const units = utils.toUnits(bounds, info);

      if (utils.unitsEqual(units, current)) return;

      const result = utils.put(id, units, initial);
      motioning.current.layout = result;

      onChange(result);
    },
    [motioning, info, onChange]
  );

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", height: info.containerHeight }}
    >
      {React.Children.map(children, (item, i) => {
        const id = item.key;
        const inMotion = motioning.current?.id === id;

        return (
          <Provider
            key={id}
            id={id}
            units={layout[id]}
            info={info}
            components={components}
            onMotionStart={onMotionStart}
            onMotionEnd={onMotionEnd}
            onMotion={onMotion}
          >
            <Box motion={inMotion && motion}>{item}</Box>
          </Provider>
        );
      })}
      {!!motion && containerWidth && (
        <Lines
          style={{ position: "absolute", top: 0, left: 0 }}
          rows={rows}
          cols={cols}
          rowHeight={rowHeight}
          containerWidth={containerWidth}
        />
      )}
    </div>
  );
}

const Provider = ({
  children,
  id,
  units,
  info,
  components,
  onMotionStart,
  onMotionEnd,
  onMotion
}) => {
  const bounds = useMemo(() => utils.toBounds(units, info), [units, info]);
  const startMotion = useCallback(type => onMotionStart(id, type), [
    id,
    onMotionStart
  ]);

  return (
    <itemContext.Provider
      value={{
        components,
        bounds,
        info,
        onMotionStart: startMotion,
        onMotionEnd,
        onMotion
      }}
    >
      {children}
    </itemContext.Provider>
  );
};
