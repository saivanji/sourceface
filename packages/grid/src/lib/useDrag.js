import { useEffect, useContext } from "react";
import { context } from "./state";
import * as dom from "./dom";

export default (triggerRef, ...args) => {
  const [previewRef, type, callbacks = {}] =
    typeof args[0] !== "string" ? args : [triggerRef, ...args];

  const state = useContext(context);
  const { onStart, onMove, onEnd } = state.provide(callbacks);

  useEffect(() => {
    const mousedown = e => {
      if (e.which !== 1) return;

      let preview;
      let container = { dragged: false };

      const mousemove = e => {
        if (!container.dragged) {
          container.dragged = true;
          container.startX = e.clientX;
          container.startY = e.clientY;
          container.bodyStyles = dom.getStyles(trigger, ["user-select"]);

          document.body.style["user-select"] = "none";

          state.dragStart(type);
          onStart && onStart();

          return;
        }

        preview = previewRef.current;

        if (!preview) return;

        if (!container.previewStyles && !container.matrix) {
          const { transform, position } = window.getComputedStyle(preview);

          container.matrix = dom.toMatrix(transform);
          container.previewStyles = dom.getStyles(preview, [
            "transform",
            "position",
            "z-index"
          ]);

          dom.lower(preview, position);
        }

        const deltaX = e.clientX - container.startX;
        const deltaY = e.clientY - container.startY;

        preview.style.transform = dom.addTranslate(
          container.matrix,
          deltaX,
          deltaY
        );

        onMove && onMove();
      };

      const mouseup = () => {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);

        if (container.dragged) {
          dom.setStyles(document.body, container.bodyStyles);
          dom.setStyles(preview, container.previewStyles);

          state.dragEnd();
          onEnd && onEnd();
        }
      };

      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    };

    const trigger = triggerRef.current;

    if (!trigger) return;

    trigger.addEventListener("mousedown", mousedown);

    return () => {
      trigger.removeEventListener("mousedown", mousedown);
    };
  }, [triggerRef, previewRef, state, type, onStart, onMove, onEnd]);
};
