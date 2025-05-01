export const ItemTypes = {
  PLAYER: "player",
  BALL: "ball",
  CONE: "cone",
  GOAL: "goal",
};

export const defaultPalette = [
  { type: ItemTypes.PLAYER, label: "Player" },
  { type: ItemTypes.BALL, label: "Ball" },
  { type: ItemTypes.CONE, label: "Cone" },
  { type: ItemTypes.GOAL, label: "Goal" },
];

const ArrowTypes = {
  RUNNING: "running",
  DRIBBLING: "dribbling",
  PASS: "pass",
};
