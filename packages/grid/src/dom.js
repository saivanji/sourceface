export const getTransform = node => {
  const { m41: left, m42: top } = new window.DOMMatrix(
    window.getComputedStyle(node).transform
  );

  return { left, top };
};

export const listenDrag = (node, onDragStart, onDragEnd, onDrag) => {
  node.onmousedown = e => {
    if (e.which !== 1) return;

    const payload = onDragStart(e);

    const mousemove = e => {
      onDrag(e, payload);
    };

    const mouseup = e => {
      document.removeEventListener("mouseup", mouseup);
      document.removeEventListener("mousemove", mousemove);
      onDragEnd(e, payload);
    };

    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  };

  return () => {
    node.onmousedown = null;
  };
};

export const boundsToStyle = ({ width, height, left, top }) => ({
  width,
  height,
  transform: `translate(${left}px, ${top}px)`
});
