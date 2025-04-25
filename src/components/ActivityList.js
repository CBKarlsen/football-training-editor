import React from 'react';
import { useDrop } from 'react-dnd';

function ActivityList({ activities, onAddActivity }) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['drill', 'equipment'], // Specify the types of items that can be dropped here
    drop: (item, monitor) => {
        console.log('Item dropped:', item);
      // Handle the dropped item and add it to the activities
      if (item.type === 'drill') {
        onAddActivity({ ...item, id: Date.now() }); // Add a unique ID
      } else if (item.type === 'equipment') {
        onAddActivity({ type: 'equipment', name: item.data.name, id: Date.now() });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = isOver && canDrop;
  let backgroundColor = '#fff';
  if (isActive) {
    backgroundColor = 'lightgreen';
  } else if (canDrop) {
    backgroundColor = 'lightblue';
  }

  return (
    <div
      ref={drop}
      style={{
        backgroundColor,
        padding: '20px',
        border: '1px dashed #ccc',
        marginTop: '20px',
      }}
    >
      <h2>Activities:</h2>
      {activities.length === 0 ? (
        <p>Drag and drop elements here to build your session.</p>
      ) : (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              {activity.type === 'drill' ? (
                `Drill: ${activity.type} (${activity.duration} min, ${activity.players} players)`
              ) : activity.type === 'equipment' ? (
                `Equipment: ${activity.name}`
              ) : (
                `Unknown Activity: ${JSON.stringify(activity)}`
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ActivityList;