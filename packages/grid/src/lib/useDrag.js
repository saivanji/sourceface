import { useEffect } from "react";
import * as dom from "./dom";

export default (triggerRef, ...args) => {
  const [previewRef, type, { onStart, onMove, onEnd } = {}] =
    typeof args[0] !== "string" ? args : [triggerRef, ...args];

  useEffect(() => {
    const trigger = triggerRef.current;

    if (!trigger) return;

    trigger.onmousedown = e => {
      if (e.which !== 1) return;

      let preview;
      let state = { dragged: false };

      const mousemove = e => {
        if (!state.dragged) {
          state.dragged = true;
          state.startX = e.clientX;
          state.startY = e.clientY;
          state.triggerStyles = dom.getStyles(trigger, ["user-select"]);

          trigger.style["user-select"] = "none";

          onStart && onStart();

          return;
        }

        preview = previewRef.current;

        if (!preview) return;

        if (!state.previewStyles && !state.matrix) {
          state.previewStyles = dom.getStyles(preview, ["transform"]);
          state.matrix = dom.getTransform(preview);
        }

        const deltaX = e.clientX - state.startX;
        const deltaY = e.clientY - state.startY;

        preview.style.transform = dom.addTranslate(
          state.matrix,
          deltaX,
          deltaY
        );

        onMove && onMove();
      };

      const mouseup = () => {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);

        if (state.dragged) {
          dom.setStyles(trigger, state.triggerStyles);
          dom.setStyles(preview, state.previewStyles);
          onEnd && onEnd();
        }
      };

      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    };

    return () => {
      trigger.onmousedown = null;
    };
  }, [triggerRef, previewRef, onStart, onMove, onEnd]);
};
