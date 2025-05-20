import React from "react";
import { useDrag, DragPreviewImage } from "react-dnd";
import { ItemTypes } from "./PaletteConfig";

const DraggableItem = ({ type, id, position, children, moveItem }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type,
    item: { id, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const previewSrc = {
    [ItemTypes.PLAYER]: "/previews/player.png",
    [ItemTypes.BALL]: "/previews/ball.png",
    [ItemTypes.CONE]: "/previews/cone.png",
    [ItemTypes.GOAL]: "/previews/goal.png",
  }[type];

  return (
    <>
      {previewSrc && <DragPreviewImage connect={preview} src={previewSrc} />}
      <div
        ref={drag}
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          cursor: "move",
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        {children}
      </div>
    </>
  );
};

export default DraggableItem;