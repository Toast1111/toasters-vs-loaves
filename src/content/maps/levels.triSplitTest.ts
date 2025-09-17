// @ts-nocheck
import { LevelDefinition } from './types';

// Test level: three paths that diverge early and reconverge near exit.
// Useful for validating path weights, rendering, and enemy distribution.
export const triSplitTest: LevelDefinition = {
  id: 'tri_split_test',
  name: 'Tri-Split Test Kitchen',
  grid: { cw: 30, ch: 30 },
  pathWidth: 36,
  paths: [
    {
      id: 'north',
      weight: 2,
      waypoints: [
        { x: -20, y: 100 }, { x: 180, y: 100 }, { x: 260, y: 140 }, { x: 400, y: 140 }, { x: 540, y: 120 },
        { x: 700, y: 140 }, { x: 820, y: 180 }, { x: 920, y: 200 }, { x: 980, y: 200 }
      ]
    },
    {
      id: 'center',
      weight: 3, // Heaviest to test boss path selection
      waypoints: [
        { x: -20, y: 240 }, { x: 160, y: 240 }, { x: 300, y: 240 }, { x: 450, y: 240 }, { x: 620, y: 240 },
        { x: 760, y: 240 }, { x: 880, y: 220 }, { x: 980, y: 220 }
      ]
    },
    {
      id: 'south',
      weight: 1,
      waypoints: [
        { x: -20, y: 400 }, { x: 200, y: 400 }, { x: 280, y: 360 }, { x: 430, y: 360 }, { x: 600, y: 380 },
        { x: 760, y: 320 }, { x: 880, y: 260 }, { x: 980, y: 240 }
      ]
    }
  ]
};
