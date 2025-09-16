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
    if (pr.type !== 'muzzle') pr.vy += pr.g * dt; 
    pr.x += pr.vx * dt; 
    pr.y += pr.vy * dt; 
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
