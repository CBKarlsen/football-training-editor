import React, { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';

function ExerciseEditor({ exercise, onUpdate }) {
  const [elements, setElements] = useState(
    exercise.elements.map(el => ({ ...el, position: el.position || { x: 50, y: 50 } }))
  );
  const [actions, setActions] = useState(exercise.actions || []);

  const containerRef = useRef(null);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['element', 'action'],
    drop: (item, monitor) => {
      console.log('DROPPED ITEM:', item);
      const offset = monitor.getClientOffset();
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!offset || !containerRect) return;

      const x = offset.x - containerRect.left;
      const y = offset.y - containerRect.top;
      const newItem = { ...item, id: Date.now(), position: { x, y } };

      if (item.type === 'element') {
        const newElements = [...elements, newItem];
        setElements(newElements);
        onUpdate({ ...exercise, elements: newElements });
      } else if (item.type === 'action') {
        const newActions = [...actions, newItem];
        setActions(newActions);
        onUpdate({ ...exercise, actions: newActions });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  drop(containerRef);

  const handleDrag = (e, id) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;

    const updatedElements = elements.map(el =>
      el.id === id ? { ...el, position: { x, y } } : el
    );

    setElements(updatedElements);
    onUpdate({ ...exercise, elements: updatedElements });
  };

  const backgroundColor = isOver && canDrop ? '#def' : '#fff';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        backgroundColor,
        padding: '20px',
        border: '2px dashed #bbb',
        margin: '10px',
        minHeight: '500px',
        width: '700px',
        overflow: 'hidden',
        backgroundImage: `url('/field-background.png')`, // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <h3>{exercise.name}</h3>

      {elements.map(el => (
        <div
          key={el.id}
          style={{
            position: 'absolute',
            left: el.position.x,
            top: el.position.y,
            cursor: 'move',
            backgroundColor: 'white',
            padding: '4px 8px',
            border: '1px solid #333',
            borderRadius: '4px',
            zIndex: 10,
            userSelect: 'none'
          }}
          onMouseDown={(e) => {
            e.preventDefault();

            const handleMouseMove = (moveEvent) => handleDrag(moveEvent, el.id);
            const handleMouseUp = () => {
              window.removeEventListener('mousemove', handleMouseMove);
              window.removeEventListener('mouseup', handleMouseUp);
            };

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
          }}
        >
          {el.type} {el.team && `(${el.team})`} {el.size && `(${el.size})`}
        </div>
      ))}

      {actions.length > 0 && (
        <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
          <h4>Actions:</h4>
          <ul>
            {actions.map(action => (
              <li key={action.id}>
                {action.type} at ({Math.round(action.position?.x)}, {Math.round(action.position?.y)})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ExerciseEditor;