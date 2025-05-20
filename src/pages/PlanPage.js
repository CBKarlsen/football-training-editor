import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function PlanPage() {
  const [exercises, setExercises] = useState(
    JSON.parse(localStorage.getItem('plan')) || []
  );

  const addExercise = () => {
    const id = uuidv4();
    const newList = [...exercises, { id, name: 'Untitled Exercise' }];
    setExercises(newList);
    localStorage.setItem('plan', JSON.stringify(newList));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Training Plan</h1>
      <button onClick={addExercise}>+ New Exercise</button>
      <ul>
        {exercises.map((ex) => (
          <li key={ex.id}>
            <Link to={`/exercise/${ex.id}`}>{ex.name || ex.id}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}