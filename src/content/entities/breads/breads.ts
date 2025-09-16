// @ts-nocheck
import { waypoints } from "../../maps";
import { addScreenShake } from "../../../systems/effects";
import { rollPowerupDrop } from "../../../systems/powerups";
import { spawnExplosion, spawnDamageNumber } from "../../../systems/particles";
import { recordEnemyKilled, recordCoinsEarned } from "../../../systems/achievements";
export const breads=[];
export function spawnBread(spec){ 
  const size = spec.size === 'large' ? 20 : 12;
  const e={
    id:++_id, type:spec.type, hp:spec.hp, maxHp:spec.hp, speed:spec.speed, 
    bounty:spec.bounty, wpt:0, x:waypoints[0].x, y:waypoints[0].y, r:size, 
    alive:true, special:spec.special||null, armor:spec.armor||0,
    lastSpeedBurst: 0, regenerateTimer: 0,
    resistances: spec.resistances || {}
  }; 
  breads.push(e); 
}
export function stepBreads(dt, state){
  // Apply freeze time effect
  const effectiveDt = state._freezeActive ? dt * 0.1 : dt;
  
  for(const e of breads){
    if(!e.alive) continue;
    
    // Handle status effects from new upgrade system
    let speedMultiplier = 1;
    
    // Burn damage over time
    if(e.burnDuration > 0) {
      e.burnDuration -= dt;
      e.hp -= (e.burnDamage || 0) * dt;
      
      // Burn spread to nearby enemies
      if(e.burnSpread) {
        for(const e2 of breads) {
          if(!e2.alive || e2 === e) continue;
          const dist = Math.hypot(e.x - e2.x, e.y - e2.y);
          if(dist < 40 && Math.random() < 0.1 * dt) { // 10% chance per second
            e2.burnDuration = Math.max(e2.burnDuration || 0, 1);
            e2.burnDamage = (e.burnDamage || 0) * 0.5;
          }
        }
      }
      
      if(e.hp <= 0) {
        damageBread(e, 0, state); // Trigger death from burn
        continue;
      }
    }
    
    // Slow effect (unless immune)
    if(e.slowDuration > 0 && e.special !== 'freeze_immune') {
      e.slowDuration -= dt;
      speedMultiplier *= (1 - (e.slowAmount || 0));
    }
    
    // Stun effect
    if(e.stunDuration > 0) {
      e.stunDuration -= dt;
      speedMultiplier = 0; // Completely stopped
    }
    
    // Speed boost from volatile bread explosions
    if(e.speedBoostTimer > 0) {
      e.speedBoostTimer -= dt;
      speedMultiplier *= (e.speedBoostMultiplier || 1);
    }
    
    // Explosion armor buff (stacks with regular armor)
    if(e.explosionArmorTimer > 0) {
      e.explosionArmorTimer -= dt;
      if(e.explosionArmorTimer <= 0) {
        e.explosionArmor = 0; // Remove buff when timer expires
      }
    }
    
    // Handle special abilities
    if (e.special === 'regenerate') {
      e.regenerateTimer += effectiveDt;
      if (e.regenerateTimer >= 2 && e.hp < e.maxHp) {
        e.hp = Math.min(e.maxHp, e.hp + e.maxHp * 0.1);
        e.regenerateTimer = 0;
      }
    }
    
    let currentSpeed = e.speed * speedMultiplier;
    if (e.special === 'speed_burst') {
      e.lastSpeedBurst += effectiveDt;
      if (e.lastSpeedBurst >= 4) {
        currentSpeed = e.speed * 2.5 * speedMultiplier; // Speed burst!
        e.lastSpeedBurst = -1; // Burst for 1 second
      } else if (e.lastSpeedBurst < 0) {
        currentSpeed = e.speed * 2.5 * speedMultiplier;
        e.lastSpeedBurst += effectiveDt;
        if (e.lastSpeedBurst >= 0) e.lastSpeedBurst = 0;
      }
    }
    
    const target=waypoints[e.wpt+1];
    if(!target){ 
      e.alive=false; 
      // Bosses cause extra damage when they reach the end
      if (!state._invulnerable) {
        const damage = e.r > 15 ? 5 : 1;
        state.lives -= damage; 
        document.getElementById('lives').textContent=state.lives; 
        if(state.lives<=0) { state.running=false; } 
      }
      continue; 
    }
    const dx=target.x-e.x, dy=target.y-e.y; const d=Math.hypot(dx,dy);
    if(d<2){ e.wpt++; continue; }
    const vx=dx/d*currentSpeed, vy=dy/d*currentSpeed; e.x+=vx*effectiveDt; e.y+=vy*effectiveDt;
  }
}
// Define splitting patterns for different bread types
const SPLIT_PATTERNS = {
  'bag_of_loaf': { into: 'whole_loaf', count: 6, sizeMultiplier: 0.7, statMultiplier: 0.5 },
  'whole_loaf': { into: 'half_loaf', count: 3, sizeMultiplier: 0.6, statMultiplier: 0.4 },
  'artisan_loaf': { into: 'slice', count: 4, sizeMultiplier: 0.5, statMultiplier: 0.35 },
  'half_loaf': { into: 'slice', count: 2, sizeMultiplier: 0.7, statMultiplier: 0.5 },
  'dinner_roll': { into: 'crumb', count: 3, sizeMultiplier: 0.4, statMultiplier: 0.3 },
  'sourdough_boss': { into: 'sourdough_split', count: 3, sizeMultiplier: 0.4, statMultiplier: 0.3 }
};

export function damageBread(e, dmg, state, damageType = 'physical'){
  // Calculate base damage after armor (including temporary explosion armor)
  const totalArmor = (e.armor || 0) + (e.explosionArmor || 0);
  let actualDamage = dmg * (1 - totalArmor);
  
  // Apply damage type resistances/vulnerabilities
  if (e.resistances && e.resistances[damageType] !== undefined) {
    actualDamage *= (1 - e.resistances[damageType]);
  }
  
  // Ensure minimum damage (can't be completely immune)
  actualDamage = Math.max(actualDamage, dmg * 0.05);
  
  e.hp -= actualDamage; 
  
  // Show damage number with color coding for resistances
  const isCrit = actualDamage > e.maxHp * 0.3;
  const isResisted = e.resistances && e.resistances[damageType] > 0;
  const isVulnerable = e.resistances && e.resistances[damageType] < 0;
  spawnDamageNumber(e.x, e.y - 10, actualDamage, isCrit, isResisted, isVulnerable);
  
  if(e.hp <= 0){ 
    e.alive = false; 
    
    // Record kill for achievements
    recordEnemyKilled(e);
    
    // Special death effects for certain enemy types
    handleSpecialDeathEffects(e, state);
    
    // Death explosion
    spawnExplosion(e.x, e.y, e.r > 15 ? 20 : 8);
    
    // Roll for powerup drop
    rollPowerupDrop(e, state);
    
    // Handle splitting mechanics
    const splitPattern = SPLIT_PATTERNS[e.type];
    if (splitPattern) {
      for (let i = 0; i < splitPattern.count; i++) {
        const angle = (i * Math.PI * 2 / splitPattern.count) + Math.random() * 0.5;
        const distance = e.r + 15;
        const splitBread = {
          id: ++_id, 
          type: splitPattern.into, 
          hp: Math.ceil(e.maxHp * splitPattern.statMultiplier), 
          maxHp: Math.ceil(e.maxHp * splitPattern.statMultiplier),
          speed: e.speed * (1 + Math.random() * 0.3), // Slightly randomize speed
          bounty: Math.ceil(e.bounty * splitPattern.statMultiplier), 
          wpt: e.wpt,
          x: e.x + Math.cos(angle) * distance, 
          y: e.y + Math.sin(angle) * distance,
          r: Math.ceil(e.r * splitPattern.sizeMultiplier), 
          alive: true, 
          special: null, 
          armor: 0,
          lastSpeedBurst: 0, 
          regenerateTimer: 0,
          resistances: {}
        };
        breads.push(splitBread);
      }
      
      // Visual feedback for splitting
      addScreenShake(4, 0.3);
      import('../../../ui/game').then(({ UI }) => {
        if (UI && UI.log) {
          UI.log(`🍞 ${e.type} split into ${splitPattern.count} ${splitPattern.into}s!`);
        }
      }).catch(err => console.warn('Failed to log split:', err));
    }
    
    // Legacy boss splitting (keeping for compatibility with existing sourdough_boss)
    else if (e.special === 'split' && e.r > 15) {
      // Split into 3 smaller versions
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2 / 3) + Math.random() * 0.5;
        const splitBread = {
          id: ++_id, type: 'sourdough_split', hp: e.maxHp * 0.3, maxHp: e.maxHp * 0.3,
          speed: e.speed * 1.2, bounty: Math.floor(e.bounty * 0.3), wpt: e.wpt,
          x: e.x + Math.cos(angle) * 25, y: e.y + Math.sin(angle) * 25,
          r: 8, alive: true, special: null, armor: 0,
          lastSpeedBurst: 0, regenerateTimer: 0, resistances: {}
        };
        breads.push(splitBread);
      }
    }
    
    const bonus = Math.round(e.bounty * state.global.bounty); 
    state.coins += bonus; 
    recordCoinsEarned(bonus); // Record for achievements
    document.getElementById('coins').textContent = state.coins;
    
    // Extra effects for boss kills
    if (e.r > 15) {
      // Add screen shake and bonus AP for boss kills
      state.ap += 2;
  addScreenShake(8, 0.5);
  import('../../../ui/game').then(({ UI }) => {
    if (UI && UI.log) {
      UI.log(`💀 Boss defeated! +2 AP bonus!`);
    }
  }).catch(err => console.warn('Failed to log boss defeat:', err));
    }
  }
}

// Handle special death effects for specific enemy types
function handleSpecialDeathEffects(e, state) {
  switch(e.type) {
    case 'moldy_bread':
      // Spread poison cloud that damages nearby enemies
      import('../../../systems/particles').then(({ spawnPoisonCloud }) => {
        spawnPoisonCloud(e.x, e.y, 40, 3000); // 40px radius, 3 second duration
      }).catch(err => console.warn('Failed to spawn poison cloud:', err));
      
      // Log special death effect
      import('../../../ui/game').then(({ UI }) => {
        if (UI && UI.log) {
          UI.log(`☠️ Moldy bread released toxic spores!`);
        }
      }).catch(err => console.warn('Failed to log moldy death:', err));
      break;
      
    case 'frozen_bread':
      // Create frost nova that slows nearby enemies
      breads.forEach(other => {
        if (other.alive && other.id !== e.id) {
          const dx = other.x - e.x;
          const dy = other.y - e.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 60) {
            other.slowTimer = Math.max(other.slowTimer || 0, 4000); // 4 second slow
            other.slowMultiplier = 0.3; // 70% speed reduction
          }
        }
      });
      
      import('../../../ui/game').then(({ UI }) => {
        if (UI && UI.log) {
          UI.log(`❄️ Frozen bread created a frost nova!`);
        }
      }).catch(err => console.warn('Failed to log frost nova:', err));
      break;
      
    case 'volatile_bread':
      // Explosive healing that buffs nearby enemies - dangerous to let explode!
      const explosionRadius = 80;
      let enemiesBuffed = 0;
      breads.forEach(other => {
        if (other.alive && other.id !== e.id) {
          const dx = other.x - e.x;
          const dy = other.y - e.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < explosionRadius) {
            const healingPower = 1 - dist / explosionRadius;
            
            // Heal nearby enemies
            const healAmount = Math.ceil(other.maxHp * 0.3 * healingPower);
            other.hp = Math.min(other.maxHp, other.hp + healAmount);
            
            // Speed buff
            other.speedBoostTimer = 5000; // 5 second boost
            other.speedBoostMultiplier = 1 + (0.5 * healingPower); // Up to 50% speed boost
            
            // Temporary armor buff
            other.explosionArmor = (other.explosionArmor || 0) + (0.3 * healingPower);
            other.explosionArmorTimer = 8000; // 8 second armor buff
            
            enemiesBuffed++;
            
            // Show healing numbers in green
            spawnDamageNumber(other.x, other.y - 15, healAmount, false, false, false, true);
          }
        }
      });
      
      import('../../../ui/game').then(({ UI }) => {
        if (UI && UI.log) {
          if (enemiesBuffed > 0) {
            UI.log(`💥💚 Volatile bread explosion healed and buffed ${enemiesBuffed} enemies!`);
          } else {
            UI.log(`💥 Volatile bread exploded harmlessly!`);
          }
        }
      }).catch(err => console.warn('Failed to log explosion:', err));
      break;
  }
}

let _id=0;
