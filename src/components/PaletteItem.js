import React from 'react';
import { useDrag } from 'react-dnd';

export default function PaletteItem({ type, label }) {
  const [, drag] = useDrag({
    type,
    item: { type },
  });
  return (
    <div
      ref={drag}
      style={{
        marginBottom: 8,
        padding: '6px 12px',
        background: '#f9f9f9',
        border: '1px solid #ccc',
        borderRadius: 4,
        cursor: 'move',
      }}
    >
      {label}
    </div>
  );
}