import { useEffect, useContext } from "react";
import { context } from "./state";

export default (targetRef, types, callbacks = {}) => {
  const state = useContext(context);
  const { onEnter, onLeave, onHover, onDrop } = state.provide(callbacks);

  useEffect(() => {
    const target = targetRef.current;

    // TODO: how to make sure drop event fires always before drag end?
    // it might happen that drop event will fire last which will cause the loss of that event. Because we delete drag type on drag end.
    // Does browser fires mouse up for childs earlier than for the document?
    const listener = callback => () => {
      if (types.includes(state.type())) {
        callback && callback();
      }
    };

    const hover = listener(onHover);
    const enter = listener(onEnter);
    const leave = listener(onLeave);
    const drop = listener(onDrop);

    target.addEventListener("mousemove", hover);
    target.addEventListener("mouseenter", enter);
    target.addEventListener("mouseleave", leave);
    target.addEventListener("mouseup", drop);

    return () => {
      target.removeEventListener("mousemove", hover);
      target.removeEventListener("mouseenter", enter);
      target.removeEventListener("mouseleave", leave);
      target.removeEventListener("mouseup", drop);
    };
  }, [targetRef, state, types, onEnter, onLeave, onHover, onDrop]);
};
