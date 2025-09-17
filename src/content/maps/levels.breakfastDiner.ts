// @ts-nocheck
import { LevelDefinition } from './types';

// Breakfast Diner level with two intersecting paths that converge before the exit, 90-degree angles only
export const breakfastDiner: LevelDefinition = {
  id: 'breakfast_diner',
  name: 'Breakfast Diner',
  grid: { cw: 30, ch: 30 },
  pathWidth: 36,
  paths: [
    { 
      // Upper diner service path - weaves down and up
      id: 'upper_service',
      waypoints: [
        { x: -20, y: 120 }, 
        { x: 180, y: 120 }, 
        { x: 180, y: 240 },  // Goes down to intersect
        { x: 340, y: 240 }, 
        { x: 340, y: 120 },  // Back up
        { x: 500, y: 120 }, 
        { x: 500, y: 300 },  // Down again to intersect
        { x: 680, y: 300 }, 
        { x: 680, y: 180 },  // Back up
        { x: 800, y: 180 }, 
        { x: 800, y: 240 },  // Final convergence point
        { x: 980, y: 240 }
      ],
      weight: 1.5
    },
    { 
      // Lower kitchen path - weaves up and down
      id: 'lower_kitchen',
      waypoints: [
        { x: -20, y: 360 }, 
        { x: 160, y: 360 }, 
        { x: 160, y: 240 },  // Goes up to intersect with upper path
        { x: 320, y: 240 }, 
        { x: 320, y: 380 },  // Back down
        { x: 480, y: 380 }, 
        { x: 480, y: 300 },  // Up again to intersect
        { x: 640, y: 300 }, 
        { x: 640, y: 420 },  // Back down
        { x: 800, y: 420 }, 
        { x: 800, y: 240 },  // Final convergence point (same as upper)
        { x: 980, y: 240 }
      ],
      weight: 1
    }
  ]
};