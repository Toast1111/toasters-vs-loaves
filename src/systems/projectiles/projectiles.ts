// @ts-nocheck
import { breads, damageBread } from "../../content/entities/breads";
import { spawnSplashExplosion } from "../particles";
export const projectiles=[];

// Object pool for performance optimization
const projectilePool = [];
let _id = 0;

function getPooledProjectile() {
  return projectilePool.pop() || {};
}

function returnToPool(projectile) {
  // Reset all properties to avoid contamination
  for (let key in projectile) {
    delete projectile[key];
  }
  projectilePool.push(projectile);
}

export function fireFrom(t, target, customDamage = null){
  // Safety check - if tower data is invalid, just return
  if (!t || !target) return;
  
  // Calculate launch position offset for missile launchers
  let launchX = t.x;
  let launchY = t.y;
  
  if(t.missileSlots && t.slotIndex !== undefined) {
    // Position missile launch based on slot index
    const slots = t.missileSlots;
    const slotIndex = t.slotIndex;
    const angle = (slotIndex * Math.PI * 2 / Math.max(slots, 4)) - Math.PI/2;
    const radius = slots > 4 ? 8 : 6;
    launchX += Math.cos(angle) * radius;
    launchY += Math.sin(angle) * radius;
  }
  
  const angle=Math.atan2(target.y-launchY, target.x-launchX);
  const speed=t.projectileSpeed || 300; // Add fallback
  const damage = customDamage || t.damage || 1; // Add fallback
  
  console.log(`DEBUG: fireFrom - tower damage=${t.damage}, customDamage=${customDamage}, final damage=${damage}`);
  
  // Get projectile from pool and initialize all properties
  const p = getPooledProjectile();
  p.id = ++_id;
  p.x = launchX;
  p.y = launchY;
  
  // Handle arcing fire for missile launchers
  if(t.arcingFire && t.missileSlots) {
    // Calculate proper ballistic trajectory for missiles
    const distance = Math.hypot(target.x - launchX, target.y - launchY);
    const deltaX = target.x - launchX;
    const deltaY = target.y - launchY;
    
    // Enhanced ballistic trajectory calculation for dramatic arc
    const launchAngle = Math.PI / 4; // 45 degrees for maximum range/dramatic arc
    const gravity = 200; // Adjusted gravity for visible but realistic arc
    
    // Calculate time to target and initial velocity
    const horizontalDistance = Math.abs(deltaX);
    const verticalDistance = deltaY;
    
    // Calculate required initial velocity for ballistic trajectory
    const denominator = Math.sin(2 * launchAngle);
    const initialSpeed = Math.sqrt((gravity * horizontalDistance * horizontalDistance) / 
                                  (horizontalDistance * Math.tan(launchAngle) - verticalDistance) / Math.cos(launchAngle) / Math.cos(launchAngle));
    
    // Set initial velocity components for dramatic high arc
    const launchDirection = deltaX >= 0 ? 1 : -1;
    p.vx = launchDirection * initialSpeed * Math.cos(launchAngle);
    p.vy = -initialSpeed * Math.sin(launchAngle); // Negative for upward launch
    
    // Missile-specific properties
    p.gravity = gravity;
    p.arcTarget = {x: target.x, y: target.y};
    p.startX = launchX;
    p.startY = launchY;
    p.isArcing = true;
    p.isMissile = true;
    p.arcingFire = true;
    p.flightTime = 0;
    p.maxFlightTime = 8; // Maximum flight time before forced ground impact
    
    // Enhanced projectile lifetime for arcing missiles
    p.life = 10; // Longer life for arcing projectiles
    
    // Copy ammo type information from tower
    p.ammoType = t.currentAmmoType || 'standard';
    
    // Initialize exhaust trail for missiles
    p.exhaustTrail = [];
  } else {
    // Normal straight-line trajectory
    p.vx = Math.cos(angle)*speed;
    p.vy = Math.sin(angle)*speed;
  }
  
  p.dmg = damage;
  console.log(`DEBUG: Projectile created with dmg=${p.dmg}`);
  p.pierce = t.pierce || 0;
  p.splash = t.splash || 0;
  p.splashDmg = t.splashDmg || 0;
  // Don't override life for missiles - they need longer life for ballistic trajectories
  if(!p.isMissile) {
    p.life = t.unlimitedRange ? 10 : (t._projectileLifetime || (t.range / speed));
  }
  p.damageType = t.damageType || 'physical';
  p.splashType = t.splashType || 'explosion';
  // Special upgrade effects
  p.burnChance = t.burnChance || 0;
  p.burnDamage = t.burnDamage || 0;
  p.burnSpread = t.burnSpread || false;
  p.slowChance = t.slowChance || 0;
  p.slowAmount = t.slowAmount || 0;
  p.stunChance = t.stunChance || 0;
  p.stunDuration = t.stunDuration || 0;
  p.homing = t.homing || false;
  p.ricochet = t.ricochet || false;
  p.bounceCount = t.bounceCount || 0;
  p.source = t;
  // Explosive projectiles
  p.explosive = t.explosive || false;
  p.lifetime = t.explosiveLifetime || 0;
  p.explosionRadius = t.explosionRadius || 0;
  p.damage = damage; // For explosive damage calculation
  // Clear dead flag
  p.dead = false;
  
  projectiles.push(p);
  
        // Create additional projectiles for multi-shot
      for (let i = 1; i < t.multiShot; i++) {
        const spreadAngle = angle + (i - (t.multiShot - 1) / 2) * 0.3;
        
        const extraP = getPooledProjectile();
        extraP.id = ++_id;
        extraP.x = t.x;
        extraP.y = t.y;
        extraP.vx = Math.cos(spreadAngle) * speed;
        extraP.vy = Math.sin(spreadAngle) * speed;
        extraP.dmg = damage;
        extraP.pierce = t.pierce || 0;
        extraP.splash = t.splash || 0;
        extraP.splashDmg = t.splashDmg || 0;
        extraP.life = t.unlimitedRange ? 2 : (t._projectileLifetime || (t.range / speed));
        extraP.unlimitedRange = t.unlimitedRange || false;
        extraP.damageType = t.damageType || 'physical';
        extraP.splashType = t.splashType || 'explosion';
        
        projectiles.push(extraP);
      }
}

export function stepProjectiles(dt, state){
  for(const p of projectiles){ 
    // Handle explosive projectiles differently
    if(p.explosive) {
      // Explosive projectiles use lifetime instead of life
      p.x += p.vx * dt; 
      p.y += p.vy * dt; 
      p.lifetime -= dt;
      
      // Check for collision with enemies
      let hitEnemy = false;
      for(const e of breads) {
        if(!e.alive) continue;
        if(Math.hypot(p.x - e.x, p.y - e.y) <= e.r) {
          hitEnemy = true;
          break;
        }
      }
      
      // Explode on impact or when lifetime expires
      if(hitEnemy || p.lifetime <= 0) {
        // Create explosion at projectile location
        import('../particles').then(({spawnExplosion}) => {
          spawnExplosion(p.x, p.y, Math.floor(p.explosionRadius / 3));
        }).catch(err => console.warn('Failed to spawn explosion:', err));
        
        // Damage all enemies in explosion radius
        for(const e of breads) {
          if(!e.alive) continue;
          const dist = Math.hypot(p.x - e.x, p.y - e.y);
          if(dist <= p.explosionRadius) {
            // Damage falloff with distance
            const falloff = Math.max(0.3, 1 - (dist / p.explosionRadius));
            const explosionDamage = p.damage * falloff;
            damageBread(e, explosionDamage, state, 'explosion');
          }
        }
        
        p.dead = true;
        continue;
      }
    } else {
      // Standard projectile behavior
      // Homing behavior
      if(p.homing && p.life > 0.5) {
        let closestEnemy = null;
        let closestDist = Infinity;
        for(const e of breads) {
          if(!e.alive) continue;
          const dist = Math.hypot(p.x - e.x, p.y - e.y);
          if(dist < closestDist && dist < 200) { // Homing range
            closestDist = dist;
            closestEnemy = e;
          }
        }
        if(closestEnemy) {
          const targetAngle = Math.atan2(closestEnemy.y - p.y, closestEnemy.x - p.x);
          const currentAngle = Math.atan2(p.vy, p.vx);
          const angleDiff = targetAngle - currentAngle;
          const turnRate = 3.0; // Turn speed
          const newAngle = currentAngle + Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), turnRate * dt);
          const speed = Math.hypot(p.vx, p.vy);
          p.vx = Math.cos(newAngle) * speed;
          p.vy = Math.sin(newAngle) * speed;
        }
      }
      
      // Handle arcing missiles with proper ballistic physics
      if(p.isArcing && p.isMissile) {
        p.flightTime += dt;
        
        // Apply gravity to create realistic ballistic arc
        p.vy += p.gravity * dt;
        
        // Check for ground impact or target area reached
        const groundLevel = 400; // Lower ground level for smaller screens
        const reachedTargetArea = p.flightTime > p.maxFlightTime * 0.7; // Impact at 70% of max flight time
        const hitGround = p.y > groundLevel;
        
        if(hitGround || reachedTargetArea || p.flightTime > p.maxFlightTime) {
          // Missile impacts - create explosion
          p.groundImpact = true;
          p.impactX = p.x;
          p.impactY = hitGround ? Math.min(p.y, groundLevel) : p.y;
          // Don't mark as dead here - let the ground impact handler do it
        }
      }
      
      p.x+=p.vx*dt; p.y+=p.vy*dt; p.life-=dt;
      
      // Update exhaust trail for missiles
      if(p.isMissile && p.exhaustTrail) {
        // Add current position to trail
        p.exhaustTrail.push({
          x: p.x,
          y: p.y,
          life: 0.5, // Trail segment life
          maxLife: 0.5
        });
        
        // Update and remove old trail segments
        for(let i = p.exhaustTrail.length - 1; i >= 0; i--) {
          const segment = p.exhaustTrail[i];
          segment.life -= dt;
          if(segment.life <= 0) {
            p.exhaustTrail.splice(i, 1);
          }
        }
        
        // Limit trail length for performance
        if(p.exhaustTrail.length > 15) {
          p.exhaustTrail.shift();
        }
      } 
      
      // Handle ground impact for missiles BEFORE life check
      if(p.groundImpact && p.isMissile) {
        // Create splash explosion effect at impact point
        console.log('Missile impact at:', p.impactX, p.impactY, 'splash radius:', p.splash || 40);
        const splashRadius = p.splash || 40;
        spawnSplashExplosion(p.impactX, p.impactY, splashRadius, Math.floor(splashRadius / 3));
        
        // Apply splash damage to nearby enemies
        if(p.splash > 0) {
          for(const e of breads) {
            if(!e.alive) continue;
            const dist = Math.hypot(p.impactX - e.x, p.impactY - e.y);
            if(dist <= p.splash) {
              const splashDamage = p.splashDmg || (p.dmg * 0.5);
              const falloff = 1 - (dist / p.splash);
              const finalDamage = Math.floor(splashDamage * falloff);
              if(finalDamage > 0) {
                damageBread(e, finalDamage, state, 'explosion');
              }
            }
          }
        }
        
        // Remove the projectile after ground impact
        p.dead = true;
        continue; // Skip normal collision detection
      }
      
      if(p.life<=0) p.dead=true;
      
      // Skip direct enemy collision for missiles - they only explode on ground impact
      if(p.isMissile) {
        continue; // Missiles don't do direct hits, only ground explosions
      }
      
      for(const e of breads){ 
        if(!e.alive) continue; 
        if(Math.hypot(p.x-e.x,p.y-e.y)<=e.r){
          damageBread(e,p.dmg,state, p.damageType || 'physical');
          
          // Apply status effects
          if(p.burnChance > 0 && Math.random() < p.burnChance) {
            applyBurn(e, p.burnDamage, p.burnSpread);
          }
          if(p.slowChance > 0 && Math.random() < p.slowChance) {
            applySlow(e, p.slowAmount);
          }
          if(p.stunChance > 0 && Math.random() < p.stunChance) {
            applyStun(e, p.stunDuration);
          }
          
          // Chain Lightning effect
          if(p.chainLightning && p.chainCount > 0) {
            performChainLightning(p, e, state);
          }
          
          // Splash damage
          if(p.splash>0){ 
            for(const e2 of breads){ 
              if(!e2.alive) continue; 
              const d=Math.hypot(p.x-e2.x,p.y-e2.y); 
              if(d<=p.splash && e2!==e){ 
                damageBread(e2,p.splashDmg,state, p.splashType || 'explosion');
                // Apply status effects to splash targets too
                if(p.burnChance > 0 && Math.random() < p.burnChance * 0.5) {
                  applyBurn(e2, p.burnDamage * 0.7, false);
                }
              } 
            } 
          }
          
          // Ricochet behavior
          if(p.ricochet && p.bounceCount > 0) {
            let nextTarget = null;
            let closestDist = Infinity;
            for(const e2 of breads) {
              if(!e2.alive || e2 === e) continue;
              const dist = Math.hypot(p.x - e2.x, p.y - e2.y);
              if(dist < closestDist && dist < 150) { // Ricochet range
                closestDist = dist;
                nextTarget = e2;
              }
            }
            if(nextTarget) {
              const newAngle = Math.atan2(nextTarget.y - p.y, nextTarget.x - p.x);
              const speed = Math.hypot(p.vx, p.vy) * 0.8; // Slight speed reduction
              p.vx = Math.cos(newAngle) * speed;
              p.vy = Math.sin(newAngle) * speed;
              p.bounceCount--;
              continue; // Don't pierce/die, ricochet instead
            }
          }
          
          if(p.pierce>0) p.pierce--; else { p.dead=true; break; }
        }
      }
    }
  }
  // Clean up dead projectiles and return them to pool
  for(let i=projectiles.length-1;i>=0;i--) {
    if(projectiles[i].dead) {
      returnToPool(projectiles[i]);
      projectiles.splice(i,1);
    }
  }
}

// Status effect functions
function applyBurn(enemy, damage, canSpread) {
  enemy.burnDamage = damage;
  enemy.burnDuration = 3; // 3 seconds of burning
  if(canSpread) {
    enemy.burnSpread = true;
  }
}

function applySlow(enemy, amount) {
  enemy.slowAmount = Math.max(enemy.slowAmount || 0, amount);
  enemy.slowDuration = 2; // 2 seconds of slowing
}

function applyStun(enemy, duration) {
  enemy.stunned = true;
  enemy.stunDuration = Math.max(enemy.stunDuration || 0, duration);
}

// Chain Lightning function
function performChainLightning(projectile, firstEnemy, state) {
  if(!projectile.chainHitEnemies) {
    projectile.chainHitEnemies = [];
  }
  
  // Add the first enemy to the hit list
  projectile.chainHitEnemies.push(firstEnemy.id);
  
  // Apply stun to the first enemy
  applyStun(firstEnemy, projectile.chainStunDuration);
  
  // Create visual lightning effect
  import('../particles').then(({spawnChainLightningArc}) => {
    if(spawnChainLightningArc) {
      spawnChainLightningArc(projectile.x, projectile.y, firstEnemy.x, firstEnemy.y, 0);
    }
  }).catch(() => {}); // Ignore if lightning effect doesn't exist
  
  let currentEnemy = firstEnemy;
  let chainsRemaining = Math.min(projectile.chainCount - 1, 7); // -1 because we already hit the first enemy
  
  for(let i = 0; i < chainsRemaining; i++) {
    // Find the closest enemy that hasn't been hit yet
    let nextTarget = null;
    let closestDist = Infinity;
    const maxChainRange = 120; // Maximum distance for chain to jump
    
    for(const enemy of breads) {
      if(!enemy.alive) continue;
      if(projectile.chainHitEnemies.includes(enemy.id)) continue; // Skip already hit enemies
      
      const dist = Math.hypot(currentEnemy.x - enemy.x, currentEnemy.y - enemy.y);
      if(dist < closestDist && dist <= maxChainRange) {
        closestDist = dist;
        nextTarget = enemy;
      }
    }
    
    if(!nextTarget) break; // No more valid targets within range
    
    // Damage and stun the next target
    damageBread(nextTarget, projectile.chainDamage, state, 'lightning');
    applyStun(nextTarget, projectile.chainStunDuration);
    projectile.chainHitEnemies.push(nextTarget.id);
    
    // Create visual lightning effect between current and next enemy
    import('../particles').then(({spawnChainLightningArc}) => {
      if(spawnChainLightningArc) {
        spawnChainLightningArc(currentEnemy.x, currentEnemy.y, nextTarget.x, nextTarget.y, i + 1);
      }
    }).catch(() => {}); // Ignore if lightning effect doesn't exist
    
    currentEnemy = nextTarget;
  }
  
  // Clear chain lightning properties after use
  projectile.chainLightning = false;
  projectile.chainCount = 0;
}
