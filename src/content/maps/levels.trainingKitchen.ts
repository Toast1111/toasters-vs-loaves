// @ts-nocheck
import { LevelDefinition } from './types';

export const trainingKitchen: LevelDefinition = {
  id: 'training_kitchen',
  name: 'Training Kitchen',
  grid: { cw: 30, ch: 30 },
  pathWidth: 36,
  paths: [
    {
      id: 'main',
      waypoints: [
        { x: -20, y: 80 }, { x: 160, y: 80 }, { x: 160, y: 160 }, { x: 320, y: 160 }, { x: 320, y: 60 },
        { x: 560, y: 60 }, { x: 560, y: 260 }, { x: 420, y: 260 }, { x: 420, y: 420 }, { x: 780, y: 420 },
        { x: 780, y: 200 }, { x: 980, y: 200 }
      ],
      weight: 1
    }
  ]
};
