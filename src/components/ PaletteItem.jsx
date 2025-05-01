import React from "react";
import { useDrag, DragPreviewImage } from "react-dnd";

const PaletteItem = ({ type, label }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type,
    item: { type, label },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const previewSrc = {
    player: "/player.png",
    ball: "/previews/ball.png",
    cone: "/previews/cone.png",
    goal: "/previews/goal.png",
  }[type];

  return (
    <>
      {previewSrc && <DragPreviewImage connect={preview} src={previewSrc} />}
      <div
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: "grab",
          marginBottom: 8,
          padding: 8,
          border: "1px solid #ccc",
          borderRadius: 4,
          background: "white",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        {label}
      </div>
    </>
  );
};

export default PaletteItem;