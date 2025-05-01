import React, { useState, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";
import PaletteItem from "./components/ PaletteItem";
import { defaultPalette, ItemTypes } from "./components/PaletteConfig";
import { DragPreviewImage } from "react-dnd";







const DraggableItem = ({ type, id, position, children, moveItem }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type,
    item: { id, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Define preview image path based on type
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

const Field = ({ exercise, addItem, moveItem, renamePlayer, drawingArrow, setDrawingArrow }) => {
  const [tempArrow, setTempArrow] = useState(null);
  const fieldRef = useRef(null);

  const [{ isOver }, drop] = useDrop(() => ({
    // This is the drop target for adding new items
    accept: [ItemTypes.PLAYER, ItemTypes.BALL, ItemTypes.CONE, ItemTypes.GOAL],
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const fieldRect = document.getElementById("field")?.getBoundingClientRect();
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
        backgroundImage: `url('/field-background.png')`, // Add the image here
        backgroundSize: "cover", // Ensure the image covers the entire field
        backgroundPosition: "center", // Center the image
        borderRadius: 10,
        boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)",
        backgroundColor: isOver ? "#e8ffe8" : "#f9f9f9", // Optional: Add a slight overlay when dragging
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


export default function TrainingEditor() {
  const [exercise, setExercise] = useState(() => {
    const saved = localStorage.getItem("trainingDSL");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Dribbling Practice",
          field: { width: 600, height: 400 },
          players: [],
          balls: [],
          arrows: [],
        };
  });

  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [palette, setPalette] = useState(defaultPalette);
  const [drawingArrow, setDrawingArrow] = useState(null);

  const updateExercise = (newState) => {
    setHistory((prev) => [...prev, exercise]);
    setFuture([]);
    setExercise(newState);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setFuture((f) => [exercise, ...f]);
    setHistory((h) => h.slice(0, h.length - 1));
    setExercise(previous);
  };

  useEffect(() => {
    localStorage.setItem("trainingDSL", JSON.stringify(exercise));
  }, [exercise]);

  const addItem = (type, position) => {
    if (type === ItemTypes.PLAYER) {
      setExercise((prev) => ({
        ...prev,
        players: [
          ...prev.players,
          {
            id: uuidv4(),
            type: 'player',
            name: `Player ${prev.players.length + 1}`,
            position,
          },
        ],
      }));
    } else if (type === ItemTypes.BALL) {
      setExercise((prev) => ({
        ...prev,
        balls: [
          ...prev.balls,
          {
            id: uuidv4(),
            type: 'ball',
            position,
          },
        ],
      }));
    } else if (type === ItemTypes.CONE) {
      setExercise((prev) => ({
        ...prev,
        cones: [
          ...(prev.cones || []),
          {
            id: uuidv4(),
            type: 'cone',
            position,
          },
        ],
      }));
    } else if (type === ItemTypes.GOAL) {
      setExercise((prev) => ({
        ...prev,
        goals: [
          ...(prev.goals || []),
          {
            id: uuidv4(),
            type: 'goal',
            position,
          },
        ],
      }));
    }
  };

  const moveItem = (type, id, newPos) => {
    if (type === ItemTypes.PLAYER) {
      updateExercise({
        ...exercise,
        players: exercise.players.map((p) => (p.id === id ? { ...p, position: newPos } : p)),
      });
    }
    if (type === ItemTypes.BALL) {
      updateExercise({
        ...exercise,
        balls: exercise.balls.map((b) => (b.id === id ? { ...b, position: newPos } : b)),
      });
    }
    if (type === 'arrow') {
      updateExercise({
        ...exercise,
        arrows: [...(exercise.arrows || []), newPos],
      });
    }
  };

  const renamePlayer = (id, newName) => {
    updateExercise({
      ...exercise,
      players: exercise.players.map((p) => (p.id === id ? { ...p, name: newName } : p)),
    });
  };

  const clearExercise = () => {
    if (window.confirm("Clear current exercise?")) {
      updateExercise({ name: "Dribbling Practice", field: { width: 600, height: 400 }, players: [], balls: [], arrows: [] });
    }
  };

  const downloadExercise = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exercise, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `${exercise.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    document.body.removeChild(dlAnchor);
  };

  const uploadExercise = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        updateExercise(json);
      } catch (err) {
        alert("Failed to load exercise JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 300px", gap: 20, padding: 20, fontFamily: "sans-serif" }}>
        <div style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
          <h3 style={{ marginBottom: 12 }}>Palette</h3>
          {palette.map((item) => (
            <PaletteItem key={item.type} type={item.type} label={item.label} />
          ))}
          <h4 style={{ marginTop: 12 }}>Arrows</h4>
          {['run', 'dribble', 'pass'].map((type) => (
            <button
              key={type}
              onClick={() => setDrawingArrow({ type })}
              style={{
                marginTop: 4,
                width: "100%",
                padding: "4px 6px",
                background: drawingArrow?.type === type ? "#d0ffd0" : "#f9f9f9",
                border: "1px solid #ccc",
                borderRadius: 4,
                cursor: "pointer"
              }}
            >
              {type}
            </button>
          ))}
          <button onClick={undo} style={{ marginTop: 8, padding: "6px 12px", background: "#eee", border: "1px solid #ccc", borderRadius: 4, cursor: "pointer" }}>Undo</button>
          <button onClick={clearExercise} style={{ marginTop: 8, padding: "6px 12px", background: "#eee", border: "1px solid #ccc", borderRadius: 4, cursor: "pointer" }}>Clear</button>
          <button onClick={downloadExercise} style={{ marginTop: 8, padding: "6px 12px", background: "#eee", border: "1px solid #ccc", borderRadius: 4, cursor: "pointer" }}>Save</button>
          <input type="file" accept="application/json" onChange={uploadExercise} style={{ marginTop: 8 }} />
        </div>
        <Field exercise={exercise} addItem={addItem} moveItem={moveItem} renamePlayer={renamePlayer} drawingArrow={drawingArrow} setDrawingArrow={setDrawingArrow} />
        <div style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.1)", overflow: "auto", maxHeight: 420 }}>
          <h3>DSL Preview</h3>
          <pre style={{ background: "#f1f1f1", padding: 10, borderRadius: 4, fontSize: 12 }}>{JSON.stringify(exercise, null, 2)}</pre>
        </div>
      </div>
    </DndProvider>
  );
}
