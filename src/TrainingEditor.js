import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";
import Field from "./components/Field";
import PaletteItem from "./components/PaletteItem";
import { defaultPalette, ItemTypes } from "./components/PaletteConfig";
import { downloadExercise } from "./utils/downloadExercise";
import uploadExercise from "./utils/uploadExercise";

export default function TrainingEditor({ exerciseId }) {
  const [exercise, setExercise] = useState(() => {
    const saved = localStorage.getItem(`trainingDSL:${exerciseId}`);
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
    localStorage.setItem(`trainingDSL:${exerciseId}`, JSON.stringify(exercise));
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