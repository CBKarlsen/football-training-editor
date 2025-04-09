import React, { useState } from 'react';

function DrillEditor({ onAdd }) {
  const [type, setType] = useState('Passing');
  const [duration, setDuration] = useState(5);
  const [players, setPlayers] = useState(4);

  const handleAddDrill = () => {
    onAdd({ type, duration: parseInt(duration), players: parseInt(players) });
    // Reset form (optional)
    setType('Passing');
    setDuration(5);
    setPlayers(4);
  };

  return (
    <div>
      <h3>Add New Drill</h3>
      <label htmlFor="drillType">Type:</label>
      <select id="drillType" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Passing">Passing</option>
        <option value="Shooting">Shooting</option>
        <option value="Dribbling">Dribbling</option>
        {/* Add more drill types as needed */}
      </select>

      <label htmlFor="drillDuration">Duration (min):</label>
      <input
        type="number"
        id="drillDuration"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <label htmlFor="drillPlayers">Players:</label>
      <input
        type="number"
        id="drillPlayers"
        value={players}
        onChange={(e) => setPlayers(e.target.value)}
      />

      <button onClick={handleAddDrill}>Add Drill to Session</button>
    </div>
  );
}

export default DrillEditor;