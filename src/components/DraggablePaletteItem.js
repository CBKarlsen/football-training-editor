// components/DraggablePaletteItem.js
import React from 'react';
import { useDrag } from 'react-dnd';

function DraggablePaletteItem({ type, data, label }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type, // 'element' or 'action' for the DnD backend
    item: { ...data, itemType: type }, // rename internal type to `itemType`
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '10px',
        border: '1px solid #ccc',
        marginBottom: '8px',
        backgroundColor: '#fff',
        cursor: 'move',
      }}
    >
      {label}
    </div>
  );
}

export default DraggablePaletteItem;