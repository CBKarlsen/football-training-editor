import React, { useState } from 'react';
import './App.css';
import SessionNameEditor from './components/SessionNameEditor';
import ActivityList from './components/ActivityList';
import AddActivityButton from './components/AddActivityButton';
import DrillEditor from './components/DrillEditor';

function App() {
  const [session, setSession] = useState({
    name: "New Session",
    activities: []
  });
  const [isAddingDrill, setIsAddingDrill] = useState(false);

  const handleSessionNameChange = (newName) => {
    setSession({ ...session, name: newName });
  };

  const handleAddDrill = (newDrill) => {
    setSession({ ...session, activities: [...session.activities, newDrill] });
    setIsAddingDrill(false); // Close the drill editor after adding
  };

  const toggleAddDrill = () => {
    setIsAddingDrill(!isAddingDrill);
  };

  const handleSave = () => {
    console.log("Current Training Session (DSL representation as JSON):", JSON.stringify(session, null, 2));
  };

  return (
    <div className="App">
      <h1>Football Training Session Editor</h1>

      <SessionNameEditor sessionName={session.name} onNameChange={handleSessionNameChange} />

      <AddActivityButton onAddDrill={toggleAddDrill} />

      {isAddingDrill && <DrillEditor onAdd={handleAddDrill} />}

      <ActivityList activities={session.activities} />

      <button onClick={handleSave}>Save (Log to Console)</button>
    </div>
  );
}

export default App;