import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback
} from "react";
import Lines from "./Lines";
import Item from "./Item";
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

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", height: info.containerHeight }}
    >
      {React.Children.map(children, (item, i) => {
        const id = item.key;
        const inMotion = motioning.current?.id === id;

        return (
          <ItemProvider
            key={id}
            id={id}
            motioning={motioning}
            layout={layout}
            info={info}
            components={components}
            onChange={onChange}
            onMotionToggle={setMotion}
          >
            <Item motion={inMotion && motion}>{item}</Item>
          </ItemProvider>
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

const ItemProvider = ({
  children,
  id,
  motioning,
  layout,
  info,
  components,
  onChange,
  onMotionToggle
}) => {
  const bounds = useMemo(() => utils.toBounds(layout[id], info), [
    layout,
    info,
    id
  ]);

  const onMotionStart = useCallback(
    type => {
      motioning.current = { id, ...layout[id] };
      onMotionToggle(type);
    },
    [motioning, layout, id, onMotionToggle]
  );

  const onMotionEnd = useCallback(() => {
    onMotionToggle(null);
    motioning.current = null;
  }, [motioning, onMotionToggle]);

  const onMotion = useCallback(
    bounds => {
      const initial = motioning.current;
      const units = utils.toUnits(bounds, info, initial);

      if (utils.unitsEqual(units, initial)) return;

      Object.assign(motioning.current, units);
      onChange({ ...layout, [initial.id]: units });
    },
    [motioning, layout, info, onChange]
  );

  return (
    <itemContext.Provider
      value={{
        components,
        bounds,
        info,
        onMotionStart,
        onMotionEnd,
        onMotion
      }}
    >
      {children}
    </itemContext.Provider>
  );
};
