// @ts-nocheck
import { LevelDefinition } from './types';

// Demonstration level with two parallel lanes that converge near the end.
export const dualLanes: LevelDefinition = {
  id: 'dual_lanes',
  name: 'Dual Lanes Kitchen',
  grid: { cw: 30, ch: 30 },
  pathWidth: 36,
  paths: [
    { // Upper lane (slightly heavier)
      id: 'upper',
      waypoints: [
        { x: -20, y: 120 }, { x: 200, y: 120 }, { x: 200, y: 200 }, { x: 400, y: 200 }, { x: 400, y: 150 },
        { x: 650, y: 150 }, { x: 650, y: 240 }, { x: 880, y: 240 }, { x: 980, y: 240 }
      ],
      weight: 2
    },
    { // Lower lane
      id: 'lower',
      waypoints: [
        { x: -20, y: 360 }, { x: 250, y: 360 }, { x: 250, y: 300 }, { x: 480, y: 300 }, { x: 480, y: 360 },
        { x: 730, y: 360 }, { x: 730, y: 260 }, { x: 880, y: 260 }, { x: 980, y: 260 }
      ],
      weight: 1
    }
  ]
};
