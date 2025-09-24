// @ts-nocheck
/**
 * Wave Configuration Helper
 * 
 * This file provides utilities and examples for creating custom wave configurations
 * for different maps in the Toasters vs Loaves game.
 */

import { registerMapWaveConfig } from './waves';

// Helper function to create bread spawn configs with common patterns
export function createBreadConfig(type: string, options: {
  count?: number | ((wave: number) => number);
  baseHp?: number;
  hpPerWave?: number;
  baseSpeed?: number;
  speedPerWave?: number;
  bounty?: number;
  special?: string;
  resistances?: Record<string, number>;
  armor?: number;
  size?: string;
}) {
  return {
    type,
    count: options.count || 1,
    baseHp: options.baseHp || 50,
    hpPerWave: options.hpPerWave || 5,
    baseSpeed: options.baseSpeed || 60,
    speedPerWave: options.speedPerWave || 1,
    bounty: options.bounty || 5,
    ...(options.special && { special: options.special }),
    ...(options.resistances && { resistances: options.resistances }),
    ...(options.armor && { armor: options.armor }),
    ...(options.size && { size: options.size })
  };
}

// Predefined bread type configurations for common enemies
export const BreadTypes = {
  // Basic enemies
  slice: (count: number | ((n: number) => number) = (n) => 10 + Math.floor(n * 1.5)) => 
    createBreadConfig('slice', {
      count,
      baseHp: 20,
      hpPerWave: 4,
      baseSpeed: 70,
      speedPerWave: 1.5,
      bounty: 4
    }),

  baguette: (count: number | ((n: number) => number) = (n) => 6 + Math.floor(n/2)) => 
    createBreadConfig('baguette', {
      count,
      baseHp: 80,
      hpPerWave: 10,
      baseSpeed: 60,
      speedPerWave: 1.2,
      bounty: 9
    }),

  rye: (count: number | ((n: number) => number) = (n) => 3 + Math.floor(n/3)) => 
    createBreadConfig('rye', {
      count,
      baseHp: 180,
      hpPerWave: 18,
      baseSpeed: 55,
      speedPerWave: 1.1,
      bounty: 15
    }),

  // Splittable enemies
  halfLoaf: (count: number | ((n: number) => number) = (n) => 2 + Math.floor(n/6)) => 
    createBreadConfig('half_loaf', {
      count,
      baseHp: 120,
      hpPerWave: 12,
      baseSpeed: 50,
      speedPerWave: 1,
      bounty: 20
    }),

  wholeLoaf: (count: number | ((n: number) => number) = (n) => 1 + Math.floor(n/8)) => 
    createBreadConfig('whole_loaf', {
      count,
      baseHp: 250,
      hpPerWave: 20,
      baseSpeed: 45,
      speedPerWave: 0.8,
      bounty: 35
    }),

  dinnerRoll: (count: number | ((n: number) => number) = (n) => 4 + Math.floor(n/4)) => 
    createBreadConfig('dinner_roll', {
      count,
      baseHp: 60,
      hpPerWave: 6,
      baseSpeed: 75,
      speedPerWave: 2,
      bounty: 12
    }),

  // Special enemies
  butter: (count: number | ((n: number) => number) = (n) => 1 + Math.floor(n/8)) => 
    createBreadConfig('butter', {
      count,
      baseHp: 60,
      hpPerWave: 8,
      baseSpeed: 45,
      speedPerWave: 0.8,
      bounty: 18,
      special: 'trail'
    }),

  charredBread: (count: number | ((n: number) => number) = (n) => 2 + Math.floor(n/5)) => 
    createBreadConfig('charred_bread', {
      count,
      baseHp: 150,
      hpPerWave: 15,
      baseSpeed: 55,
      speedPerWave: 1.2,
      bounty: 25,
      resistances: { fire: 0.8, frost: -0.5 }
    }),

  frozenBread: (count: number | ((n: number) => number) = (n) => 2 + Math.floor(n/6)) => 
    createBreadConfig('frozen_bread', {
      count,
      baseHp: 180,
      hpPerWave: 18,
      baseSpeed: 50,
      speedPerWave: 1,
      bounty: 35,
      special: 'freeze_immune',
      resistances: { frost: 0.9, fire: -0.7 }
    }),

  volatileBread: (count: number | ((n: number) => number) = (n) => 1 + Math.floor(n/8)) => 
    createBreadConfig('volatile_bread', {
      count,
      baseHp: 120,
      hpPerWave: 12,
      baseSpeed: 60,
      speedPerWave: 1.5,
      bounty: 30,
      resistances: { explosion: 0.5 }
    }),

  // Bosses
  sourdoughBoss: (count: number = 1) => 
    createBreadConfig('sourdough_boss', {
      count,
      baseHp: 800,
      hpPerWave: 200,
      baseSpeed: 40,
      speedPerWave: 2,
      bounty: 150,
      special: 'split',
      size: 'large'
    }),

  frenchBoss: (count: number = 1) => 
    createBreadConfig('french_boss', {
      count,
      baseHp: 600,
      hpPerWave: 150,
      baseSpeed: 35,
      speedPerWave: 2,
      bounty: 120,
      special: 'speed_burst',
      size: 'large'
    }),

  pretzelBoss: (count: number = 1) => 
    createBreadConfig('pretzel_boss', {
      count,
      baseHp: 1200,
      hpPerWave: 300,
      baseSpeed: 25,
      speedPerWave: 1,
      bounty: 200,
      special: 'armor',
      armor: 0.5,
      size: 'large'
    })
};

// Helper function to create wave conditions
export const WaveConditions = {
  waves: (...waves: number[]) => (n: number) => waves.includes(n),
  range: (start: number, end: number) => (n: number) => n >= start && n <= end,
  every: (interval: number, offset: number = 0) => (n: number) => (n - offset) % interval === 0,
  after: (wave: number) => (n: number) => n >= wave,
  notBoss: () => (n: number) => n % 10 !== 0
};

// Example: Create a simple configuration for a new map
export function createSimpleMapConfig(mapId: string) {
  registerMapWaveConfig({
    mapId,
    defaultWaves: [
      {
        wave: 0,
        breads: [
          BreadTypes.slice(),
          BreadTypes.baguette((n) => n >= 3 ? 4 + Math.floor(n/2) : 0),
          BreadTypes.rye((n) => n >= 5 ? 2 + Math.floor(n/3) : 0)
        ],
        condition: WaveConditions.notBoss()
      }
    ],
    bossWaves: {
      10: {
        wave: 10,
        isBoss: true,
        breads: [
          BreadTypes.baguette(4), // escorts
          BreadTypes.sourdoughBoss()
        ]
      }
    }
  });
}

// Example: Create an advanced configuration with custom waves
export function createAdvancedMapConfig(mapId: string) {
  registerMapWaveConfig({
    mapId,
    defaultWaves: [
      // Early game
      {
        wave: 0,
        breads: [BreadTypes.slice()],
        condition: WaveConditions.range(1, 5)
      },
      // Mid game
      {
        wave: 0,
        breads: [
          BreadTypes.slice((n) => 8 + Math.floor(n * 1.2)),
          BreadTypes.baguette(),
          BreadTypes.charredBread((n) => n >= 8 ? 1 + Math.floor(n/4) : 0)
        ],
        condition: WaveConditions.range(6, 15)
      }
    ],
    customWaves: {
      // Special challenge waves
      7: {
        wave: 7,
        breads: [BreadTypes.frozenBread(10)]
      },
      13: {
        wave: 13,
        breads: [
          BreadTypes.volatileBread(5),
          BreadTypes.charredBread(8)
        ]
      }
    },
    bossWaves: {
      10: {
        wave: 10,
        isBoss: true,
        breads: [
          BreadTypes.baguette(4),
          BreadTypes.sourdoughBoss()
        ]
      },
      20: {
        wave: 20,
        isBoss: true,
        breads: [
          BreadTypes.rye(6),
          BreadTypes.frenchBoss()
        ]
      }
    }
  });
}