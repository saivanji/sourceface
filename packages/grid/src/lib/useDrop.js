import { useEffect, useContext } from "react";
import { context } from "./state";

export default (targetRef, types, callbacks = {}) => {
  const state = useContext(context);
  const { onEnter, onLeave, onHover, onDrop } = state.provide(callbacks);

  useEffect(() => {
    const target = targetRef.current;

    const listener = callback => () => {
      if (types.includes(state.type())) {
        callback && callback();
      }
    };

    const move = listener(onHover);
    const enter = listener(onEnter);
    const leave = listener(onLeave);
    const up = listener(onDrop);

    target.addEventListener("mousemove", move);
    target.addEventListener("mouseenter", enter);
    target.addEventListener("mouseleave", leave);
    target.addEventListener("mouseup", up);

    return () => {
      target.removeEventListener("mousemove", move);
      target.removeEventListener("mouseenter", enter);
      target.removeEventListener("mouseleave", leave);
      target.removeEventListener("mouseup", up);
    };
  }, [targetRef, state, types, onEnter, onLeave, onHover, onDrop]);
};
