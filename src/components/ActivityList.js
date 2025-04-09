import React from 'react';

function ActivityList({ activities }) {
  return (
    <div>
      <h2>Activities:</h2>
      {activities.length === 0 ? (
        <p>No activities added yet.</p>
      ) : (
        <ul>
          {activities.map((activity, index) => (
            <li key={index}>
              {activity.type ? ( // It's a Drill
                `Drill: ${activity.type} (${activity.duration} min, ${activity.players} players)`
              ) : ( // It's a Break (for now, we only have Drill)
                `Break: ${activity.duration} min`
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ActivityList;