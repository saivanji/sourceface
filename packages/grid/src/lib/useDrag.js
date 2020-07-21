import { useRef, useEffect, useState, useContext } from "react";
import { context } from "./state";
import * as dom from "./dom";

export default (type, callbacks = {}) => {
  const ref = useRef();
  const [state, setState] = useState(initialState);
  const { provide, dragStart, dragEnd } = useContext(context);

  const { onStart, onMove, onEnd } = provide(callbacks);

  useEffect(() => {
    const trigger = ref.current;

    const mousedown = e => {
      let local = {};

      if (e.which !== 1) return;

      const mousemove = e => {
        if (!local.dragged) {
          local.dragged = true;
          local.startX = e.clientX;
          local.startY = e.clientY;
          local.bodyStyles = dom.getStyles(trigger, ["user-select"]);

          document.body.style["user-select"] = "none";

          setState(state => ({
            ...state,
            isDragging: true
          }));

          dragStart(type);
          onStart && onStart();

          return;
        }

        const deltaX = e.clientX - local.startX;
        const deltaY = e.clientY - local.startY;

        setState(state => ({
          ...state,
          deltaX,
          deltaY
        }));

        onMove && onMove({ deltaX, deltaY });
      };

      const mouseup = () => {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);

        if (local.dragged) {
          dom.setStyles(document.body, local.bodyStyles);

          setState(initialState);

          dragEnd();
          onEnd && onEnd();
        }
      };

      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    };

    trigger.addEventListener("mousedown", mousedown);

    return () => {
      trigger.removeEventListener("mousedown", mousedown);
    };
  }, [type, dragStart, dragEnd, onStart, onMove, onEnd]);

  return [ref, state];
};

const initialState = {
  isDragging: false,
  deltaX: 0,
  deltaY: 0
};
