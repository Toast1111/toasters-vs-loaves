// @ts-nocheck
import { breads, damageBread } from "./breads";
export const projectiles=[];

export function fireFrom(t, target, customDamage = null){
  const angle=Math.atan2(target.y-t.y, target.x-t.x);
  const speed=t.projectileSpeed;
  const damage = customDamage || t.damage;
  
  // Enhanced projectile with new upgrade effects
  const p={
    id:++_id, x:t.x, y:t.y, 
    vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed, 
    dmg:damage, pierce:(t.pierce||0), 
    splash:t.splash||0, splashDmg:t.splashDmg||0, 
    life: t._projectileLifetime || (t.range / speed), // Use cached value or fallback
    // New upgrade effects
    burnChance: t.burnChance || 0,
    burnDamage: t.burnDamage || 0,
    burnSpread: t.burnSpread || false,
    slowChance: t.slowChance || 0,
    slowAmount: t.slowAmount || 0,
    stunChance: t.stunChance || 0,
    stunDuration: t.stunDuration || 0,
    homing: t.homing || false,
    ricochet: t.ricochet || false,
    bounceCount: t.bounceCount || 0,
    source: t // Reference to source tower for network effects
  };
  
  projectiles.push(p);
  
  // Handle multi-shot from upgrades
  if(t.multiShot && t.multiShot > 1) {
    for(let i = 1; i < t.multiShot; i++) {
      const spreadAngle = angle + (Math.random() - 0.5) * 0.3; // 0.3 radian spread
      const extraP = {
        ...p,
        id: ++_id,
        vx: Math.cos(spreadAngle) * speed,
        vy: Math.sin(spreadAngle) * speed
      };
      projectiles.push(extraP);
    }
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
        import('./particles').then(({spawnExplosion}) => {
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
            damageBread(e, explosionDamage, state);
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
      
      p.x+=p.vx*dt; p.y+=p.vy*dt; p.life-=dt; 
      if(p.life<=0) p.dead=true;
      
      for(const e of breads){ 
        if(!e.alive) continue; 
        if(Math.hypot(p.x-e.x,p.y-e.y)<=e.r){
          damageBread(e,p.dmg,state);
          
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
          
          // Splash damage
          if(p.splash>0){ 
            for(const e2 of breads){ 
              if(!e2.alive) continue; 
              const d=Math.hypot(p.x-e2.x,p.y-e2.y); 
              if(d<=p.splash && e2!==e){ 
                damageBread(e2,p.splashDmg,state);
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
  for(let i=projectiles.length-1;i>=0;i--) if(projectiles[i].dead) projectiles.splice(i,1);
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
  enemy.stunDuration = Math.max(enemy.stunDuration || 0, duration);
}

let _id=0;
