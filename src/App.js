import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";

const ItemTypes = {
  PLAYER: "player",
  BALL: "ball",
};

const palette = [
  { type: ItemTypes.PLAYER, label: "Player" },
  { type: ItemTypes.BALL, label: "Ball" },
];

const DraggableItem = ({ type, id, position, children, moveItem }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { id, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: [ItemTypes.PLAYER, ItemTypes.BALL],
    hover: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const fieldRect = document.getElementById("field")?.getBoundingClientRect();
      if (!offset || !fieldRect) return;
      const newPos = {
        x: offset.x - fieldRect.left,
        y: offset.y - fieldRect.top,
      };
      moveItem(item.type, item.id, newPos);
    },
  }));

  return (
    <div
      ref={(node) => drag(drop(node))}
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
  );
};

const Field = ({ exercise, addItem, moveItem, renamePlayer }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [ItemTypes.PLAYER, ItemTypes.BALL],
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

  return (
    <div
      id="field"
      ref={drop}
      style={{
        width: 600,
        height: 400,
        border: "2px solid #4caf50",
        position: "relative",
        background: isOver ? "#e8ffe8" : "#f9f9f9",
        borderRadius: 10,
        boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)",
      }}
    >
      {exercise.players.map((p) => (
        <DraggableItem key={p.id} id={p.id} type={ItemTypes.PLAYER} position={p.position} moveItem={moveItem}>
          <div
            style={{
              background: "#2196f3",
              color: "white",
              padding: "4px 10px",
              borderRadius: 6,
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
            onDoubleClick={() => {
              const newName = prompt("Rename player:", p.name);
              if (newName) renamePlayer(p.id, newName);
            }}
          >
            {p.name}
          </div>
        </DraggableItem>
      ))}
      {exercise.balls.map((b) => (
        <DraggableItem key={b.id} id={b.id} type={ItemTypes.BALL} position={b.position} moveItem={moveItem}>
          <div
            style={{
              background: "orange",
              width: 20,
              height: 20,
              borderRadius: "50%",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          />
        </DraggableItem>
      ))}
    </div>
  );
};

const PaletteItem = ({ type, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
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
        };
  });

  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

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
  };

  const renamePlayer = (id, newName) => {
    updateExercise({
      ...exercise,
      players: exercise.players.map((p) => (p.id === id ? { ...p, name: newName } : p)),
    });
  };

  const clearExercise = () => {
    if (window.confirm("Clear current exercise?")) {
      updateExercise({ name: "Dribbling Practice", field: { width: 600, height: 400 }, players: [], balls: [] });
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
          <button onClick={undo} style={{ marginTop: 8, padding: "6px 12px", background: "#eee", border: "1px solid #ccc", borderRadius: 4, cursor: "pointer" }}>Undo</button>
          <button onClick={clearExercise} style={{ marginTop: 8, padding: "6px 12px", background: "#eee", border: "1px solid #ccc", borderRadius: 4, cursor: "pointer" }}>Clear</button>
          <button onClick={downloadExercise} style={{ marginTop: 8, padding: "6px 12px", background: "#eee", border: "1px solid #ccc", borderRadius: 4, cursor: "pointer" }}>Save</button>
          <input type="file" accept="application/json" onChange={uploadExercise} style={{ marginTop: 8 }} />
        </div>
        <Field exercise={exercise} addItem={addItem} moveItem={moveItem} renamePlayer={renamePlayer} />
        <div style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.1)", overflow: "auto", maxHeight: 420 }}>
          <h3>DSL Preview</h3>
          <pre style={{ background: "#f1f1f1", padding: 10, borderRadius: 4, fontSize: 12 }}>{JSON.stringify(exercise, null, 2)}</pre>
        </div>
      </div>
    </DndProvider>
  );
}
