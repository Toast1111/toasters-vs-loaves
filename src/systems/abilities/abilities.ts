// @ts-nocheck
import { breads, damageBread } from '../../content/entities/breads';
import { createHeatZone, addScreenShake } from '../effects';
import { recordAbilityUsed } from '../achievements';

export const specialAbilities = {
  LIGHTNING_STRIKE: {
    name: 'Lightning Strike',
    hotkey: 'Q',
    cooldown: 15,
    cost: 100,
    description: 'Strikes all enemies with lightning, dealing massive damage',
    currentCooldown: 0,
    effect: (game) => {
      let hitCount = 0;
      for (const bread of breads) {
        if (bread.alive) {
          damageBread(bread, 150, game.state);
          hitCount++;
        }
      }
      addScreenShake(10, 0.8);
      import('../../ui/game').then(({ UI }) => {
        if (UI && UI.log) {
          UI.log(`⚡ Lightning Strike hit ${hitCount} enemies!`);
        }
      }).catch(err => console.warn('Failed to log lightning strike:', err));
    }
  },
  
  HEAT_WAVE: {
    name: 'Heat Wave',
    hotkey: 'W',
    cooldown: 20,
    cost: 150,
    description: 'Creates heat zones at all enemy positions',
    currentCooldown: 0,
    effect: (game) => {
      let zoneCount = 0;
      for (const bread of breads) {
        if (bread.alive) {
          createHeatZone(bread.x, bread.y, 60, 12, 4);
          zoneCount++;
        }
      }
      addScreenShake(6, 0.4);
      import('../../ui/game').then(({ UI }) => {
        if (UI && UI.log) {
          UI.log(`🔥 Heat Wave created ${zoneCount} burning zones!`);
        }
      }).catch(err => console.warn('Failed to log heat wave:', err));
    }
  },
  
  REPAIR_ALL: {
    name: 'Repair All',
    hotkey: 'E',
    cooldown: 25,
    cost: 200,
    description: 'Instantly repairs 50 lives and gives temporary invulnerability',
    currentCooldown: 0,
    effect: (game) => {
      // Use the difficulty's starting lives as the maximum, or fallback to 100
      const maxLives = game.state.currentDifficulty?.startingLives || 100;
      game.state.lives = Math.min(maxLives, game.state.lives + 50);
      game.state._invulnerable = true;
      setTimeout(() => {
        game.state._invulnerable = false;
      }, 5000);
      
      import('../../ui/game').then(({ UI }) => {
        if (UI && UI.log && UI.sync) {
          UI.log(`💚 Repaired 50 lives + 5s invulnerability!`);
          UI.sync(game);
        }
      }).catch(err => console.warn('Failed to log repair:', err));
      
      addScreenShake(4, 0.3);
    }
  },
  
  EMERGENCY_COINS: {
    name: 'Emergency Coins',
    hotkey: 'R',
    cooldown: 30,
    cost: 0, // Free but long cooldown
    description: 'Grants emergency coins based on current wave',
    currentCooldown: 0,
    effect: (game) => {
      const bonus = 200 + game.state.wave * 25;
      game.state.coins += bonus;
      
      import('../../ui/game').then(({ UI }) => {
        if (UI && UI.log && UI.sync) {
          UI.log(`💰 Emergency funds: +${bonus} coins!`);
          UI.sync(game);
        }
      }).catch(err => console.warn('Failed to log emergency coins:', err));
      
      addScreenShake(3, 0.2);
    }
  }
};

export function stepAbilities(dt) {
  let needsUpdate = false;
  for (const ability of Object.values(specialAbilities)) {
    if (ability.currentCooldown > 0) {
      const oldCooldown = ability.currentCooldown;
      ability.currentCooldown -= dt;
      if (ability.currentCooldown < 0) ability.currentCooldown = 0;
      if (Math.floor(oldCooldown) !== Math.floor(ability.currentCooldown)) {
        needsUpdate = true;
      }
    }
  }
  
  if (needsUpdate) {
    import('../../ui/game').then(({ UI }) => {
      if (UI && UI.refreshAbilities) {
        UI.refreshAbilities();
      }
    }).catch(err => console.warn('Failed to refresh abilities:', err));
  }
}

export function tryActivateAbility(key, game) {
  for (const ability of Object.values(specialAbilities)) {
    if (ability.hotkey.toLowerCase() === key.toLowerCase()) {
      if (ability.currentCooldown > 0) {
        import('../../ui/game').then(({ UI }) => {
          if (UI && UI.log) {
            UI.log(`${ability.name} on cooldown (${Math.ceil(ability.currentCooldown)}s)`);
          }
        }).catch(err => console.warn('Failed to log cooldown:', err));
        return false;
      }
      
      if (game.state.coins < ability.cost) {
        import('../../ui/game').then(({ UI }) => {
          if (UI && UI.log) {
            UI.log(`Not enough coins for ${ability.name} (need ${ability.cost})`);
          }
        }).catch(err => console.warn('Failed to log insufficient coins:', err));
        return false;
      }
      
      game.state.coins -= ability.cost;
      ability.currentCooldown = ability.cooldown;
      ability.effect(game);
      
      // Record ability usage for achievements
      recordAbilityUsed(key);
      
      import('../../ui/game').then(({ UI }) => {
        if (UI && UI.sync) {
          UI.sync(game);
        }
      }).catch(err => console.warn('Failed to sync UI:', err));
      
      return true;
    }
  }
  return false;
}

export function getAbilityStatus() {
  return Object.entries(specialAbilities).map(([key, ability]) => ({
    key,
    name: ability.name,
    hotkey: ability.hotkey,
    cooldown: ability.currentCooldown,
    maxCooldown: ability.cooldown,
    cost: ability.cost,
    description: ability.description,
    ready: ability.currentCooldown === 0
  }));
}
//I hate Gerald for real for real