import React, { useState, useRef } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./PaletteConfig";
import DraggableItem from "./DraggableItem";

const Field = ({ exercise, addItem, moveItem, renamePlayer, drawingArrow, setDrawingArrow }) => {
  const [tempArrow, setTempArrow] = useState(null);
  const fieldRef = useRef(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: [ItemTypes.PLAYER, ItemTypes.BALL, ItemTypes.CONE, ItemTypes.GOAL],
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const fieldRect = fieldRef.current.getBoundingClientRect();
      if (!offset || !fieldRect) return;

      const position = {
        x: offset.x - fieldRect.left,
        y: offset.y - fieldRect.top,
      };

      if (!item.id) addItem(item.type, position);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleMouseDown = (e) => {
    if (!drawingArrow) return;
    const rect = fieldRef.current.getBoundingClientRect();
    const start = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setTempArrow({ ...drawingArrow, start, end: start });
  };

  const handleMouseMove = (e) => {
    if (!tempArrow) return;
    const rect = fieldRef.current.getBoundingClientRect();
    const end = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setTempArrow((prev) => ({ ...prev, end }));
  };

  const handleMouseUp = () => {
    if (tempArrow) {
      moveItem('arrow', null, tempArrow);
      setTempArrow(null);
      setDrawingArrow(null);
    }
  };

  return (
    <div
      id="field"
      ref={(node) => {
        fieldRef.current = node;
        drop(node);
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        width: 800,
        height: 400,
        border: "2px solid #4caf50",
        position: "relative",
        backgroundImage: `url('/field-background.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 10,
        boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)",
        backgroundColor: isOver ? "#e8ffe8" : "#f9f9f9",
      }}
    >
      {exercise.players.map((p) => (
        <DraggableItem key={p.id} id={p.id} type={ItemTypes.PLAYER} position={p.position} moveItem={moveItem}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
            onDoubleClick={() => {
              const newName = prompt("Rename player:", p.name);
              if (newName) renamePlayer(p.id, newName);
            }}
          >
            <div
              style={{
                background: "#2196f3",
                width: 40,
                height: 40,
                borderRadius: "50%",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
              }}
            />
            <span
              style={{
                marginTop: 4,
                fontSize: 14,
                color: "#333",
                textAlign: "center",
              }}
            >
              {p.name}
            </span>
          </div>
        </DraggableItem>
      ))}
      {exercise.balls.map((b) => (
        <DraggableItem key={b.id} id={b.id} type={ItemTypes.BALL} position={b.position} moveItem={moveItem}>
          <img
            src={`/Users/casper/Semester 8/Dat355/football-training-editor/src/previews/ball.png`}
            alt="ball"
            style={{
              width: 32,
              height: 32,
              objectFit: "contain",
              pointerEvents: "none"
            }}
          />
        </DraggableItem>
      ))}
      {exercise.cones?.map((c) => (
        <DraggableItem key={c.id} id={c.id} type={ItemTypes.CONE} position={c.position} moveItem={moveItem}>
          <div
            style={{
              background: "yellow",
              width: 20,
              height: 20,
              borderRadius: "50%",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          />
        </DraggableItem>
      ))}
      {exercise.goals?.map((g) => (
        <DraggableItem key={g.id} id={g.id} type={ItemTypes.GOAL} position={g.position} moveItem={moveItem}>
          <div
            style={{
              background: "red",
              width: 40,
              height: 20,
              borderRadius: 4,
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          />
        </DraggableItem>
      ))}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
        {exercise.arrows?.map((a, i) => (
          <line
            key={i}
            x1={a.start.x}
            y1={a.start.y}
            x2={a.end.x}
            y2={a.end.y}
            stroke={a.type === 'pass' ? 'blue' : a.type === 'dribble' ? 'orange' : 'black'}
            strokeWidth={a.type === 'pass' ? 3 : 2}
            strokeDasharray={a.type === 'pass' ? '' : '5,5'}
            markerEnd="url(#arrowhead)"
          />
        ))}
        {tempArrow && (
          <line
            x1={tempArrow.start.x}
            y1={tempArrow.start.y}
            x2={tempArrow.end.x}
            y2={tempArrow.end.y}
            stroke={tempArrow.type === 'pass' ? 'blue' : tempArrow.type === 'dribble' ? 'orange' : 'black'}
            strokeWidth={tempArrow.type === 'pass' ? 3 : 2}
            strokeDasharray={tempArrow.type === 'pass' ? '' : '5,5'}
            markerEnd="url(#arrowhead)"
          />
        )}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="black" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

export default Field;