import React from 'react';
import DraggablePaletteItem from './DraggablePaletteItem';

function Palette() {
  return (
    <div className="palette-sidebar">
      <h2>Elements & Actions</h2>
      <DraggablePaletteItem type="element" data={{ type: 'cone' }} label="Cone" />
      <DraggablePaletteItem type="element" data={{ type: 'player', team: 'A' }} label="Player (Team A)" />
      <DraggablePaletteItem type="element" data={{ type: 'player', team: 'B' }} label="Player (Team B)" />
      <DraggablePaletteItem type="element" data={{ type: 'ball' }} label="Football" />
      <DraggablePaletteItem type="element" data={{ type: 'goal', size: 'small' }} label="Goal (Small)" />
      <DraggablePaletteItem type="action" data={{ type: 'run' }} label="Run" />
      <DraggablePaletteItem type="action" data={{ type: 'pass' }} label="Passing" />
      <DraggablePaletteItem type="action" data={{ type: 'shoot' }} label="Shot" />
      {/* Add more elements and actions */}
    </div>
  );
}

export default Palette;