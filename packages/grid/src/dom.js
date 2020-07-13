export const getTransform = node => {
  const { m41: translateX, m42: translateY } = new window.DOMMatrix(
    window.getComputedStyle(node).transform
  );

  return { translateX, translateY };
};

export const drag = (node, onDragStart, onDragEnd, onDrag) => {
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

export const boundsToStyle = bounds => ({
  width: bounds.width,
  height: bounds.height,
  transform: `translate(${bounds.x}px, ${bounds.y}px)`
});
