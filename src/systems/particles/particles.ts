// @ts-nocheck
export const particles=[];
export const damageNumbers=[];

export function spawnCrumbs(x,y,n){ 
  for(let i=0;i<n;i++) particles.push({
    x,y, 
    vx:(Math.random()*120-60), 
    vy:(Math.random()*40-40), 
    g:180, 
    life:(Math.random()*0.4+0.3),
    type:'crumb'
  }); 
}

export function spawnExplosion(x, y, intensity = 10) {
  for(let i = 0; i < intensity; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 150 + 50;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      g: 200,
      life: Math.random() * 0.6 + 0.4,
      type: 'explosion',
      color: `hsl(${Math.random() * 60 + 10}, 80%, ${Math.random() * 30 + 50}%)`
    });
  }
}

export function spawnPoisonCloud(x, y, radius = 40, duration = 3000) {
  // Create poison cloud particles
  const particleCount = Math.floor(radius / 5);
  for(let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius;
    const cloudX = x + Math.cos(angle) * distance;
    const cloudY = y + Math.sin(angle) * distance;
    
    particles.push({
      x: cloudX, 
      y: cloudY,
      vx: (Math.random() - 0.5) * 20, // Slow drift
      vy: (Math.random() - 0.5) * 20,
      g: 0, // No gravity for gas
      life: duration / 1000, // Convert to seconds
      type: 'poison',
      color: `hsla(120, 60%, ${Math.random() * 20 + 30}%, 0.6)` // Green with transparency
    });
  }
}

export function spawnMuzzleFlash(x, y, angle) {
  for(let i = 0; i < 5; i++) {
    const spread = (Math.random() - 0.5) * 0.8;
    const flashAngle = angle + spread;
    const speed = Math.random() * 100 + 80;
    particles.push({
      x, y,
      vx: Math.cos(flashAngle) * speed,
      vy: Math.sin(flashAngle) * speed,
      g: 0,
      life: 0.15,
      type: 'muzzle',
      color: '#ffff88'
    });
  }
}

export function spawnLightning(x1, y1, x2, y2, intensity = 1) {
  // Create main lightning bolt
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const segments = Math.max(3, Math.floor(distance / 20));
  
  // Generate jagged lightning path
  const points = [{x: x1, y: y1}];
  for(let i = 1; i < segments; i++) {
    const t = i / segments;
    const baseX = x1 + dx * t;
    const baseY = y1 + dy * t;
    
    // Add random perpendicular offset
    const perpX = -dy / distance;
    const perpY = dx / distance;
    const offset = (Math.random() - 0.5) * 30 * intensity;
    
    points.push({
      x: baseX + perpX * offset,
      y: baseY + perpY * offset
    });
  }
  points.push({x: x2, y: y2});
  
  // Create lightning particle
  particles.push({
    type: 'lightning',
    points: points,
    life: 0.3,
    intensity: intensity,
    color: '#66ccff',
    width: 3 * intensity
  });
  
  // Add electrical sparks at endpoints
  spawnElectricalSparks(x1, y1, 3);
  spawnElectricalSparks(x2, y2, 3);
}

export function spawnElectricalSparks(x, y, count = 5) {
  for(let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 80 + 40;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      g: 0,
      life: Math.random() * 0.4 + 0.2,
      type: 'spark',
      color: '#88ddff',
      size: Math.random() * 3 + 1
    });
  }
}

export function spawnMicrowaveBeam(x1, y1, x2, y2, projectileSpeed = 300) {
  // Calculate travel time based on distance and projectile speed
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const travelTime = distance / projectileSpeed;
  
  // Create animated microwave beam that grows over time
  particles.push({
    type: 'microwave_beam',
    x1, y1, x2, y2,
    life: travelTime + 0.1, // Beam lasts slightly longer than travel time
    totalLife: travelTime + 0.1,
    travelTime: travelTime,
    color: '#ff6600',
    width: 4,
    intensity: 1,
    progress: 0 // Animation progress from 0 to 1
  });
  
  // Add energy particles along the beam with delayed spawning
  const particleCount = Math.floor(distance / 15);
  for(let i = 0; i < particleCount; i++) {
    const t = i / particleCount; // Position along beam (0 to 1)
    const x = x1 + dx * t;
    const y = y1 + dy * t;
    const delay = t * travelTime; // Delay based on position along beam
    
    particles.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20,
      g: 0,
      life: Math.random() * 0.3 + 0.1,
      type: 'energy',
      color: '#ff9933',
      size: Math.random() * 2 + 1,
      delay: delay, // Particle will start after this delay
      spawned: false // Track if particle has been activated
    });
  }
}

export function spawnChainLightningArc(x1, y1, x2, y2, chainIndex = 0) {
  // Create more dramatic arcs for chain lightning
  const intensity = Math.max(0.5, 1 - chainIndex * 0.1); // Diminish with each chain
  spawnLightning(x1, y1, x2, y2, intensity);
  
  // Add chain-specific visual feedback
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  particles.push({
    x: midX,
    y: midY,
    type: 'chain_indicator',
    life: 0.5,
    scale: 1,
    chainIndex: chainIndex,
    color: chainIndex < 3 ? '#66ccff' : '#4499cc'
  });
}

// Additional effects for future use
export function spawnLaserBeam(x1, y1, x2, y2, color = '#ff0000', width = 2) {
  particles.push({
    type: 'laser_beam',
    x1, y1, x2, y2,
    life: 0.15,
    color: color,
    width: width,
    intensity: 1
  });
}

export function spawnFireTrail(x, y, direction, length = 5) {
  for(let i = 0; i < length; i++) {
    const angle = direction + (Math.random() - 0.5) * 0.5;
    const speed = Math.random() * 60 + 30;
    particles.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      g: -50, // Float upward
      life: Math.random() * 0.8 + 0.4,
      type: 'fire',
      color: `hsl(${Math.random() * 60}, 90%, ${Math.random() * 20 + 60}%)`,
      size: Math.random() * 4 + 2
    });
  }
}

export function spawnIceShards(x, y, count = 8) {
  for(let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 120 + 80;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      g: 200,
      life: Math.random() * 0.6 + 0.4,
      type: 'ice_shard',
      color: '#aaeeff',
      size: Math.random() * 3 + 1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 10
    });
  }
}

export function spawnPlasmaBolt(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  particles.push({
    type: 'plasma_bolt',
    x1, y1, x2, y2,
    life: 0.25,
    color: '#ff66ff',
    width: 6,
    intensity: 1
  });
  
  // Add plasma energy particles
  const particleCount = Math.floor(distance / 12);
  for(let i = 0; i < particleCount; i++) {
    const t = Math.random();
    const x = x1 + dx * t;
    const y = y1 + dy * t;
    
    particles.push({
      x: x + (Math.random() - 0.5) * 15,
      y: y + (Math.random() - 0.5) * 15,
      vx: (Math.random() - 0.5) * 40,
      vy: (Math.random() - 0.5) * 40,
      g: 0,
      life: Math.random() * 0.4 + 0.2,
      type: 'plasma_particle',
      color: '#ff99ff',
      size: Math.random() * 3 + 1
    });
  }
}

export function spawnDamageNumber(x, y, damage, isCrit = false, isResisted = false, isVulnerable = false, isHealing = false) {
  damageNumbers.push({
    x, y,
    damage: Math.round(damage),
    life: 1.5,
    vy: -60,
    isCrit,
    isResisted,
    isVulnerable,
    isHealing,
    scale: isCrit ? 1.5 : 1
  });
}

export function stepParticles(dt){ 
  for(const pr of particles){ 
    // Handle delayed particles (energy particles that spawn along the beam)
    if (pr.delay !== undefined && !pr.spawned) {
      pr.delay -= dt;
      if (pr.delay <= 0) {
        pr.spawned = true;
        pr.delay = undefined; // Clean up
      } else {
        continue; // Skip updating this particle until it's time to spawn
      }
    }
    
    // Handle animated microwave beam
    if (pr.type === 'microwave_beam' && pr.travelTime !== undefined) {
      pr.progress = Math.min(1, (pr.totalLife - pr.life) / pr.travelTime);
    }
    
    if (pr.type !== 'muzzle' && pr.type !== 'microwave_beam' && pr.type !== 'laser_beam' && pr.type !== 'lightning' && pr.type !== 'chain_indicator') {
      pr.vy += pr.g * dt; 
      pr.x += pr.vx * dt; 
      pr.y += pr.vy * dt; 
    }
    pr.life -= dt; 
    if(pr.life <= 0) pr.dead = true; 
  } 
  
  for(const dmg of damageNumbers) {
    dmg.y += dmg.vy * dt;
    dmg.vy *= 0.95; // Slow down over time
    dmg.life -= dt;
    if(dmg.life <= 0) dmg.dead = true;
  }
  
  for(let i = particles.length - 1; i >= 0; i--) {
    if(particles[i].dead) particles.splice(i, 1);
  }
  
  for(let i = damageNumbers.length - 1; i >= 0; i--) {
    if(damageNumbers[i].dead) damageNumbers.splice(i, 1);
  }
}
