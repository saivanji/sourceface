import { useEffect } from "react";

export default ({
  containerRef,
  handleRef,
  elementRef,
  style,
  onDragStart,
  onDragEnd
}) => {
  useEffect(() => {
    const { offsetLeft, offsetTop } = containerRef.current;
    const handle = handleRef.current;
    const element = elementRef.current;

    handle.onmousedown = e => {
      if (e.which !== 1) return;

      handle.style.cursor = "grabbing";

      const { left, top } = element.getBoundingClientRect();
      const shiftX = e.clientX - left;
      const shiftY = e.clientY - top;

      const move = e => {
        const x = e.pageX - shiftX - offsetLeft;
        const y = e.pageY - shiftY - offsetTop;

        element.style.transform = `translate(${x}px, ${y}px)`;
      };

      const cleanup = () => {
        document.removeEventListener("mouseup", cleanup);
        document.removeEventListener("mousemove", move);
        element.style.transform = style.transform;
        handle.style.cursor = "";
        onDragEnd();
      };

      onDragStart();
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", cleanup);
    };

    return () => {
      handle.onmousedown = null;
    };
  }, []);
};
