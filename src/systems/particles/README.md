# Custom Projectile Effects System

This system provides a comprehensive set of visual effects for towers and projectiles in the game.

## Available Effects

### Lightning Effects
- `spawnLightning(x1, y1, x2, y2, intensity)` - Basic lightning bolt between two points
- `spawnChainLightningArc(x1, y1, x2, y2, chainIndex)` - Chain lightning with numbered indicators
- `spawnElectricalSparks(x, y, count)` - Electrical sparks at a point

### Energy Effects
- `spawnMicrowaveBeam(x1, y1, x2, y2)` - Orange microwave beam with energy particles
- `spawnLaserBeam(x1, y1, x2, y2, color, width)` - Customizable laser beam
- `spawnPlasmaBolt(x1, y1, x2, y2)` - Purple plasma projectile with particles

### Elemental Effects
- `spawnFireTrail(x, y, direction, length)` - Fire particles trailing behind projectiles
- `spawnIceShards(x, y, count)` - Rotating ice fragments for freezing effects
- `spawnPoisonCloud(x, y, radius, duration)` - Poison gas cloud

### Basic Effects
- `spawnExplosion(x, y, intensity)` - Generic explosion particles
- `spawnMuzzleFlash(x, y, angle)` - Gun muzzle flash effect
- `spawnCrumbs(x, y, n)` - Bread crumb particles

## Usage Examples

### In Tower Implementation
```javascript
// For a new ice tower
if(t.type === 'ice_tower') {
  import('../systems/particles').then(({spawnLaserBeam, spawnIceShards}) => {
    spawnLaserBeam(t.x, t.y, target.x, target.y, '#aaeeff', 3);
    spawnIceShards(target.x, target.y, 5);
  });
}

// For a fire tower
if(t.type === 'fire_tower') {
  import('../systems/particles').then(({spawnFireTrail}) => {
    const angle = Math.atan2(target.y - t.y, target.x - t.x);
    spawnFireTrail(t.x, t.y, angle, 8);
  });
}
```

### For Special Abilities
```javascript
// Lightning storm ability
for(let i = 0; i < enemiesInRange.length - 1; i++) {
  spawnChainLightningArc(
    enemiesInRange[i].x, enemiesInRange[i].y,
    enemiesInRange[i + 1].x, enemiesInRange[i + 1].y,
    i
  );
}

// Plasma cannon upgrade
spawnPlasmaBolt(tower.x, tower.y, target.x, target.y);
```

## Current Implementations

### Microwave Tower
- **Regular shots**: `spawnMicrowaveBeam()` - Orange energy beam with particles
- **Chain Lightning**: `spawnChainLightningArc()` - Blue lightning with chain indicators
- **Gamma Burst**: Enhanced effects for first shot after reload

### Future Enhancements
The system is designed to be easily extensible. New effect types can be added by:
1. Adding the spawn function to `particles.ts`
2. Adding the rendering logic to `render.ts`
3. Implementing the effect in tower shooting logic

## Performance Notes
- Effects use object pooling where possible
- Particles automatically clean up when their life expires
- Visual effects are applied via dynamic imports to avoid loading unused code