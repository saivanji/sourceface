import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDrag, Provider } from "../lib";
import * as utils from "./utils";

export default function Grid({ cols, rows, rowHeight, layout, children }) {
  const [containerWidth, setContainerWidth] = useState();
  const containerRef = useRef();
  const info = useMemo(
    () => utils.toInfo(cols, rows, containerWidth, rowHeight),
    [cols, rows, containerWidth, rowHeight]
  );

  useEffect(() => {
    setContainerWidth(containerRef.current.offsetWidth);
  }, []);

  return (
    <Provider>
      <div
        ref={containerRef}
        style={{ position: "relative", height: info.containerHeight }}
      >
        {React.Children.map(children, element => {
          return (
            <BoxProvider
              key={element.key}
              coords={layout[element.key]}
              info={info}
            >
              {element}
            </BoxProvider>
          );
        })}
      </div>
    </Provider>
  );
}

const BoxProvider = ({ coords, info, children }) => {
  const ref = useRef();
  const style = useMemo(() => utils.toBoxCSS(coords, info), [coords, info]);

  useDrag(ref, TYPE);

  return (
    <div ref={ref} style={{ position: "absolute", ...style }}>
      {children}
    </div>
  );
};

const TYPE = "box";
