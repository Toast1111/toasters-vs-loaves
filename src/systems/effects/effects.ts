// @ts-nocheck
import { breads } from '../../content/entities/breads';

export const heatZones = [];
export const butterTrails = [];
export const screenShake = { intensity: 0, duration: 0 };

export function createHeatZone(x, y, radius = 50, damage = 5, duration = 3) {
  heatZones.push({
    x, y, radius, damage, duration, maxDuration: duration,
    id: ++_heatZoneId
  });
}

export function createButterTrail(x, y, radius = 25, speedBoost = 0.5, duration = 8) {
  // Pre-generate a set of splats so visuals are stable over lifetime
  const splatCount = 4 + Math.floor(Math.random() * 4); // 4-7 splats
  const splats = [];
  for(let i = 0; i < splatCount; i++) {
    const ang = Math.random() * Math.PI * 2;
    const r = Math.random() * (radius * 0.6);
    const sx = x + Math.cos(ang) * r * (0.6 + Math.random()*0.6);
    const sy = y + Math.sin(ang) * r * (0.6 + Math.random()*0.6);
    const rx = 4 + Math.random() * 10; // ellipse radius x
    const ry = 3 + Math.random() * 8;  // ellipse radius y
    const rot = Math.random() * Math.PI * 2;
    // Occasional big central blob
    if (i === 0 && Math.random() < 0.6) {
      splats.push({ x, y, rx: radius * (0.35 + Math.random()*0.2), ry: radius * (0.25 + Math.random()*0.2), rot: Math.random()*Math.PI });
    }
    splats.push({ x: sx, y: sy, rx, ry, rot });
  }
  // Compute bounding box for splats
  let minX = x - radius, minY = y - radius, maxX = x + radius, maxY = y + radius;
  for(const s of splats) {
    minX = Math.min(minX, s.x - s.rx);
    minY = Math.min(minY, s.y - s.ry);
    maxX = Math.max(maxX, s.x + s.rx);
    maxY = Math.max(maxY, s.y + s.ry);
  }
  const width = Math.ceil(maxX - minX + 4);
  const height = Math.ceil(maxY - minY + 4);
  const ox = Math.round(x - minX + 2);
  const oy = Math.round(y - minY + 2);

  // Pre-render to an offscreen canvas for performance
  let imgCanvas = null;
  try {
    imgCanvas = document.createElement('canvas');
    imgCanvas.width = Math.max(2, width);
    imgCanvas.height = Math.max(2, height);
    const ictx = imgCanvas.getContext('2d');
    if (ictx) {
      ictx.imageSmoothingEnabled = true;
      // Render splats at full opacity; we'll fade with globalAlpha on draw
      for(const s of splats) {
        ictx.save();
        ictx.translate(s.x - (minX - 2), s.y - (minY - 2));
        ictx.rotate(s.rot || 0);
        // Base body
        ictx.fillStyle = 'rgba(255, 224, 96, 1)';
        ictx.beginPath();
        ictx.ellipse(0, 0, s.rx, s.ry, 0, 0, Math.PI*2);
        ictx.fill();
        // Highlight
        ictx.fillStyle = 'rgba(255, 245, 160, 0.6)';
        ictx.beginPath();
        ictx.ellipse(-s.rx*0.25, -s.ry*0.25, s.rx*0.45, s.ry*0.35, 0, 0, Math.PI*2);
        ictx.fill();
        ictx.restore();
      }
    }
  } catch {}

  butterTrails.push({
    x, y, radius, speedBoost, duration, maxDuration: duration,
    splats,
    // Cached image and offsets for fast rendering
    img: imgCanvas,
    ox, oy,
    id: ++_butterTrailId
  });
}

export function stepEffects(dt, state) {
  // Update heat zones
  for (const zone of heatZones) {
    zone.duration -= dt;
    if (zone.duration <= 0) {
      zone.dead = true;
      continue;
    }
    
    // Damage and slow breads in zone
    for (const bread of breads) {
      if (!bread.alive) continue;
      const dist = Math.hypot(bread.x - zone.x, bread.y - zone.y);
      if (dist <= zone.radius) {
        bread.hp -= zone.damage * dt;
        // Apply temporary slow effect instead of permanently modifying speed
        bread._heatZoneSlow = true;
        bread._slowMultiplier = 0.7; // Slow effect
        if (bread.hp <= 0) {
          bread.alive = false;
          const bonus = Math.round(bread.bounty * state.global.bounty);
          state.coins += bonus;
          // keep coins display in sync for zone kills
          const coinsEl = document.getElementById('coins');
          if (coinsEl) coinsEl.textContent = state.coins;
        }
      }
    }
  }
  
  // Update butter trails
  for (const trail of butterTrails) {
    trail.duration -= dt;
    if (trail.duration <= 0) {
      trail.dead = true;
      continue;
    }
    
    // Apply speed boost to breads in trail (excluding butter enemies themselves)
    for (const bread of breads) {
      if (!bread.alive || bread.type === 'butter') continue;
      const dist = Math.hypot(bread.x - trail.x, bread.y - trail.y);
      if (dist <= trail.radius) {
        bread._butterTrailBoost = true;
        bread._butterSpeedMultiplier = 1 + trail.speedBoost; // Speed boost effect
      }
    }
  }
  
  // Clean up dead zones and trails
  for (let i = heatZones.length - 1; i >= 0; i--) {
    if (heatZones[i].dead) heatZones.splice(i, 1);
  }
  
  for (let i = butterTrails.length - 1; i >= 0; i--) {
    if (butterTrails[i].dead) butterTrails.splice(i, 1);
  }
  
  // Clear heat zone and butter trail effects for breads no longer in any zone/trail
  for (const bread of breads) {
    if (!bread.alive) continue;
    
    // Check heat zones
    let inAnyHeatZone = false;
    for (const zone of heatZones) {
      const dist = Math.hypot(bread.x - zone.x, bread.y - zone.y);
      if (dist <= zone.radius) {
        inAnyHeatZone = true;
        break;
      }
    }
    if (!inAnyHeatZone) {
      bread._heatZoneSlow = false;
      bread._slowMultiplier = 1.0;
    }
    
    // Check butter trails (excluding butter enemies themselves)
    let inAnyButterTrail = false;
    if (bread.type !== 'butter') {
      for (const trail of butterTrails) {
        const dist = Math.hypot(bread.x - trail.x, bread.y - trail.y);
        if (dist <= trail.radius) {
          inAnyButterTrail = true;
          break;
        }
      }
    }
    if (!inAnyButterTrail) {
      bread._butterTrailBoost = false;
      bread._butterSpeedMultiplier = 1.0;
    }
  }
  
  // Update screen shake
  if (screenShake.duration > 0) {
    screenShake.duration -= dt;
    screenShake.intensity *= 0.9;
  }
}

export function addScreenShake(intensity = 5, duration = 0.3) {
  screenShake.intensity = intensity;
  screenShake.duration = duration;
}

export function getAdaptiveTargeting(tower, enemies) {
  if (!enemies.length) return null;
  
  // Count enemy types and densities
  const strongEnemies = enemies.filter(e => e.hp > 100);
  const fastEnemies = enemies.filter(e => e.speed > 80);
  const closeEnemies = enemies.filter(e => e.wpt > 8); // Close to exit
  
  let targetPriority = 'balanced';
  
  if (strongEnemies.length > 3) targetPriority = 'tank';
  else if (fastEnemies.length > 5) targetPriority = 'speed';
  else if (closeEnemies.length > 2) targetPriority = 'proximity';
  
  // Apply adaptive bonuses
  const adaptiveBonus = tower.adaptiveBonus || 0;
  
  switch (targetPriority) {
    case 'tank':
      tower._tempDamage = tower.damage * (1 + adaptiveBonus);
      return strongEnemies.reduce((best, e) => 
        !best || e.hp > best.hp ? e : best, null);
        
    case 'speed':
      tower._tempFireRate = tower.fireRate * (1 + adaptiveBonus);
      return fastEnemies.reduce((best, e) => 
        !best || e.speed > best.speed ? e : best, null);
        
    case 'proximity':
      tower._tempRange = tower.range * (1 + adaptiveBonus * 0.5);
      return closeEnemies.reduce((best, e) => 
        !best || e.wpt > best.wpt ? e : best, null);
        
    default:
      return enemies.reduce((best, e) => {
        const score = (1000 - e.wpt * 50) + Math.hypot(e.x - tower.x, e.y - tower.y) * 0.1;
        return !best || score < best._score ? {...e, _score: score} : best;
      }, null);
  }
}

let _heatZoneId = 0;
let _butterTrailId = 0;
