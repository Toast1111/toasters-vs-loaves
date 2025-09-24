# Wave Configuration System

This document explains how to use the new customizable wave system in Toasters vs Loaves.

## Overview

The wave configuration system allows you to customize enemy waves per map, per wave number, and per bread type. You can:

- Define custom enemy compositions for specific waves
- Set different scaling parameters (HP, speed, count) per bread type
- Create unique boss configurations
- Apply conditions for when waves should appear
- Maintain backward compatibility with existing waves

## Basic Usage

### 1. Register a Map Configuration

```typescript
import { registerMapWaveConfig } from './content/waves';

registerMapWaveConfig({
  mapId: 'my_custom_map',
  defaultWaves: [
    // Wave configurations that apply to multiple waves
  ],
  customWaves: {
    // Specific wave overrides
    5: { /* wave 5 config */ },
    13: { /* wave 13 config */ }
  },
  bossWaves: {
    // Boss wave configurations
    10: { /* boss wave 10 config */ },
    20: { /* boss wave 20 config */ }
  }
});
```

### 2. Define Bread Spawn Configurations

```typescript
{
  type: 'slice',
  count: 15, // Fixed count
  // OR
  count: (wave) => 10 + Math.floor(wave * 1.5), // Dynamic count
  baseHp: 20,
  hpPerWave: 4, // HP increases by 4 per wave
  baseSpeed: 70,
  speedPerWave: 1.5, // Speed increases by 1.5 per wave
  bounty: 4,
  special: 'freeze_immune', // Optional special ability
  resistances: { fire: 0.8, frost: -0.5 }, // Optional resistances
  armor: 0.5, // Optional armor
  size: 'large' // Optional size
}
```

### 3. Use Wave Conditions

```typescript
{
  wave: 0, // Template wave
  breads: [/* bread configs */],
  condition: (wave) => wave >= 1 && wave <= 5 // When to apply this config
}
```

## Advanced Usage with Helpers

### Using the Helper Functions

```typescript
import { BreadTypes, WaveConditions, createAdvancedMapConfig } from './content/waves/waveConfigHelper';

// Quick map setup
createAdvancedMapConfig('my_map');

// Custom configuration using helpers
registerMapWaveConfig({
  mapId: 'challenge_map',
  defaultWaves: [
    {
      wave: 0,
      breads: [
        BreadTypes.slice(20), // 20 slices
        BreadTypes.baguette((n) => Math.floor(n/2)), // Scaling baguettes
        BreadTypes.charredBread() // Default charred bread
      ],
      condition: WaveConditions.range(1, 15) // Waves 1-15
    }
  ],
  customWaves: {
    7: {
      wave: 7,
      breads: [BreadTypes.frozenBread(10)] // 10 frozen bread challenge
    }
  }
});
```

## Available Bread Types

### Basic Enemies
- `slice` - Fast, low HP basic enemy
- `baguette` - Medium HP, medium speed
- `rye` - High HP, slower

### Splittable Enemies
- `half_loaf` - Splits when destroyed
- `whole_loaf` - Splits into multiple pieces
- `dinner_roll` - Small but splits into crumbs
- `artisan_loaf` - Premium splitter
- `bag_of_loaf` - Late game splitter

### Special Enemies
- `charred_bread` - Fire resistant, frost vulnerable
- `stale_bread` - Explosion vulnerable, piercing resistant
- `moldy_bread` - Resistant to most damage
- `frozen_bread` - Freeze immune, fire vulnerable
- `volatile_bread` - Explodes on death
- `croissant` - Regenerates health

### Boss Enemies
- `sourdough_boss` - Splits into smaller pieces
- `french_boss` - Speed bursts
- `pretzel_boss` - High armor, slow

## Wave Condition Helpers

```typescript
WaveConditions.waves(1, 3, 5) // Specific waves
WaveConditions.range(1, 10) // Wave range
WaveConditions.every(3, 1) // Every 3rd wave starting from wave 1
WaveConditions.after(5) // Wave 5 and beyond
WaveConditions.notBoss() // All non-boss waves (not divisible by 10)
```

## Examples

### Simple Early Game Map
```typescript
registerMapWaveConfig({
  mapId: 'tutorial_map',
  defaultWaves: [
    {
      wave: 0,
      breads: [
        BreadTypes.slice((n) => 8 + n) // 9 slices on wave 1, 10 on wave 2, etc.
      ],
      condition: WaveConditions.range(1, 5)
    }
  ]
});
```

### Challenge Map with Mixed Enemies
```typescript
registerMapWaveConfig({
  mapId: 'chaos_kitchen',
  defaultWaves: [
    {
      wave: 0,
      breads: [
        BreadTypes.slice(15),
        BreadTypes.charredBread(3),
        BreadTypes.frozenBread(2)
      ],
      condition: WaveConditions.notBoss()
    }
  ],
  customWaves: {
    5: {
      wave: 5,
      breads: [BreadTypes.volatileBread(20)] // Explosive chaos
    }
  },
  bossWaves: {
    10: {
      wave: 10,
      isBoss: true,
      breads: [
        BreadTypes.frozenBread(8), // Frozen escorts
        BreadTypes.pretzelBoss() // Armored boss
      ]
    }
  }
});
```

## Fallback Behavior

If no custom configuration is found for a map/wave combination, the system falls back to the original hardcoded wave generation logic. This ensures backward compatibility with existing maps.

## Map IDs

Current map IDs that can be configured:
- `training_kitchen`
- `dual_lanes` 
- `tri_split_test`
- `breakfast_diner`

## Notes

- Wave numbers start from 1
- Boss waves are typically every 10th wave (10, 20, 30, etc.)
- Count functions receive the current wave number as a parameter
- Resistances: positive values = resistance, negative values = vulnerability
- The system maintains enemy path assignment and shuffling from the original system