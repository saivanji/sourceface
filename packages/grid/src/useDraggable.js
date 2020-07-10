import { useEffect } from "react";

export default ({ ref, style, container, onDragStart, onDragEnd }) => {
  useEffect(() => {
    const { offsetLeft, offsetTop } = container.current;
    const node = ref.current;

    node.onmousedown = e => {
      if (e.which !== 1) return;

      node.style.cursor = "grabbing";

      const { left, top } = e.target.getBoundingClientRect();
      const shiftX = e.clientX - left;
      const shiftY = e.clientY - top;

      const move = e => {
        const x = e.pageX - shiftX - offsetLeft;
        const y = e.pageY - shiftY - offsetTop;

        node.style.transform = `translate(${x}px, ${y}px)`;
      };

      const cleanup = () => {
        document.removeEventListener("mouseup", cleanup);
        document.removeEventListener("mousemove", move);
        node.style.transform = style.transform;
        node.style.cursor = "";
        onDragEnd();
      };

      onDragStart();
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", cleanup);
    };

    return () => {
      node.onmousedown = null;
    };
  }, []);
};
