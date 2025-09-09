// @ts-nocheck
import { recordPowerupCollected } from './achievements';
import { addScreenShake } from './effects';
export const powerups = [];
export const activePowerups = [];

export const POWERUP_TYPES = {
  SPEED_BOOST: {
    name: 'Speed Boost',
    color: '#00ff00',
    duration: 8,
    effect: (state) => {
      state.global.fireRate *= 1.5;
      for (const t of state.toasters) t.fireRate *= 1.5;
    },
    cleanup: (state) => {
      state.global.fireRate /= 1.5;
      for (const t of state.toasters) t.fireRate /= 1.5;
    }
  },
  DAMAGE_AMP: {
    name: 'Damage Amplifier',
    color: '#ff4444',
    duration: 10,
    effect: (state) => {
      state.global.damage *= 2;
      for (const t of state.toasters) t.damage *= 2;
    },
    cleanup: (state) => {
      state.global.damage /= 2;
      for (const t of state.toasters) t.damage /= 2;
    }
  },
  COIN_MAGNET: {
    name: 'Coin Magnet',
    color: '#ffd700',
    duration: 15,
    effect: (state) => {
      state.global.bounty *= 3;
    },
    cleanup: (state) => {
      state.global.bounty /= 3;
    }
  },
  FREEZE_TIME: {
    name: 'Freeze Time',
    color: '#4da6ff',
    duration: 5,
    effect: (state) => {
      state._freezeActive = true;
    },
    cleanup: (state) => {
      state._freezeActive = false;
    }
  },
  SUPER_HEAT: {
    name: 'Super Heat',
    color: '#ff8800',
    duration: 12,
    effect: (state) => {
      state.global.pierce += 2;
      state.global.fireRate *= 1.3;
      for (const t of state.toasters) {
        t.pierce += 2;
        t.fireRate *= 1.3;
      }
    },
    cleanup: (state) => {
      state.global.pierce -= 2;
      state.global.fireRate /= 1.3;
      for (const t of state.toasters) {
        t.pierce -= 2;
        t.fireRate /= 1.3;
      }
    }
  }
};

export function spawnPowerup(x, y, type = null) {
  if (!type) {
    const types = Object.keys(POWERUP_TYPES);
    type = types[Math.floor(Math.random() * types.length)];
  }
  
  powerups.push({
    id: ++_powerupId,
    x, y, type,
    bobTime: 0,
    sparkleTime: 0,
    life: 15 // Powerup disappears after 15 seconds
  });
}

export function stepPowerups(dt, state) {
  // Update floating powerups
  for (const powerup of powerups) {
    powerup.life -= dt;
    powerup.bobTime += dt * 3;
    powerup.sparkleTime += dt * 5;
    
    if (powerup.life <= 0) {
      powerup.dead = true;
    }
  }
  
  // Clean up expired powerups
  for (let i = powerups.length - 1; i >= 0; i--) {
    if (powerups[i].dead) powerups.splice(i, 1);
  }
  
  // Update active powerup effects
  for (const active of activePowerups) {
    active.duration -= dt;
    if (active.duration <= 0) {
      active.dead = true;
      // Clean up effect
      POWERUP_TYPES[active.type].cleanup(state);
    }
  }
  
  // Clean up expired active powerups
  for (let i = activePowerups.length - 1; i >= 0; i--) {
    if (activePowerups[i].dead) activePowerups.splice(i, 1);
  }
  
  // Update UI
  import('./ui').then(({ UI }) => {
    if (UI && UI.updatePowerupDisplay) {
      UI.updatePowerupDisplay();
    }
  }).catch(err => {
    console.warn('Failed to update powerup display:', err);
  });
}

export function tryCollectPowerup(x, y, state) {
  for (const powerup of powerups) {
    const dist = Math.hypot(x - powerup.x, y - powerup.y);
    if (dist <= 25) {
      activatePowerup(powerup.type, state);
      powerup.dead = true;
      
  // Record powerup collection for achievements
  recordPowerupCollected();
      
      return true;
    }
  }
  return false;
}

export function activatePowerup(type, state) {
  // Remove existing powerup of same type
  for (const active of activePowerups) {
    if (active.type === type) {
      POWERUP_TYPES[type].cleanup(state);
      active.dead = true;
    }
  }
  
  const powerupData = POWERUP_TYPES[type];
  activePowerups.push({
    type,
    duration: powerupData.duration,
    name: powerupData.name
  });
  
  powerupData.effect(state);
  
  // Show notification
  import('./ui').then(({ UI }) => {
    if (UI && UI.log) {
      UI.log(`🚀 ${powerupData.name} activated!`);
    }
  }).catch(err => {
    console.warn('Failed to log powerup activation:', err);
  });
  
  addScreenShake(3, 0.2);
}

// Chance for enemies to drop powerups when killed
export function rollPowerupDrop(enemy, state) {
  let dropChance = 0.05; // 5% base chance
  
  if (enemy.r > 15) dropChance = 0.3; // 30% for bosses
  else if (enemy.type === 'rye') dropChance = 0.15; // 15% for tough enemies
  else if (enemy.type === 'baguette') dropChance = 0.08; // 8% for medium enemies
  
  if (Math.random() < dropChance) {
    spawnPowerup(enemy.x, enemy.y);
  }
}

let _powerupId = 0;
