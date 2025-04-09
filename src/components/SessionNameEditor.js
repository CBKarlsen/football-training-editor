import React from 'react';

function SessionNameEditor({ sessionName, onNameChange }) {
  return (
    <div>
      <label htmlFor="sessionName">Session Name:</label>
      <input
        type="text"
        id="sessionName"
        value={sessionName}
        onChange={(e) => onNameChange(e.target.value)}
      />
    </div>
  );
}

export default SessionNameEditor;