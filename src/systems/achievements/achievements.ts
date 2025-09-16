// @ts-nocheck
import { addScreenShake } from '../effects';
export const achievements = [
  {
    id: 'first_kill',
    name: 'Toasted!',
    description: 'Defeat your first bread enemy',
    unlocked: false,
    icon: '🍞'
  },
  {
    id: 'wave_10',
    name: 'Baker\'s Dozen Survivor',
    description: 'Survive 10 waves',
    unlocked: false,
    icon: '🏆'
  },
  {
    id: 'boss_killer',
    name: 'Boss Basher',
    description: 'Defeat your first boss',
    unlocked: false,
    icon: '💀'
  },
  {
    id: 'powerup_collector',
    name: 'Power Hungry',
    description: 'Collect 10 powerups',
    unlocked: false,
    icon: '⚡'
  },
  {
    id: 'tower_master',
    name: 'Master Chef',
    description: 'Build all 8 tower types',
    unlocked: false,
    icon: '👨‍🍳'
  },
  {
    id: 'coin_hoarder',
    name: 'Coin Collector',
    description: 'Accumulate 5000 coins',
    unlocked: false,
    icon: '💰'
  },
  {
    id: 'ability_user',
    name: 'Special Forces',
    description: 'Use all 4 special abilities',
    unlocked: false,
    icon: '🚀'
  }
];

export const gameStats = {
  enemiesKilled: 0,
  wavesCompleted: 0,
  bossesKilled: 0,
  powerupsCollected: 0,
  towersBuilt: new Set(),
  abilitiesUsed: new Set(),
  highestWave: 0,
  totalCoinsEarned: 0,
  playtimeSeconds: 0
};

export function checkAchievements() {
  for (const achievement of achievements) {
    if (achievement.unlocked) continue;
    
    let shouldUnlock = false;
    
    switch (achievement.id) {
      case 'first_kill':
        shouldUnlock = gameStats.enemiesKilled >= 1;
        break;
      case 'wave_10':
        shouldUnlock = gameStats.wavesCompleted >= 10;
        break;
      case 'boss_killer':
        shouldUnlock = gameStats.bossesKilled >= 1;
        break;
      case 'powerup_collector':
        shouldUnlock = gameStats.powerupsCollected >= 10;
        break;
      case 'tower_master':
        shouldUnlock = gameStats.towersBuilt.size >= 8;
        break;
      case 'coin_hoarder':
        shouldUnlock = gameStats.totalCoinsEarned >= 5000;
        break;
      case 'ability_user':
        shouldUnlock = gameStats.abilitiesUsed.size >= 4;
        break;
    }
    
    if (shouldUnlock) {
      achievement.unlocked = true;
      showAchievementUnlock(achievement);
      saveStats();
    }
  }
}

export function showAchievementUnlock(achievement) {
  import('../../ui/game').then(({ UI }) => {
    if (UI && UI.log && UI.refreshAchievements) {
      UI.log(`🎉 Achievement Unlocked: ${achievement.icon} ${achievement.name}!`);
      UI.refreshAchievements(); // Refresh the achievements display
    }
  }).catch(err => console.warn('Failed to show achievement unlock:', err));
    addScreenShake(5, 0.3);
}

export function recordEnemyKilled(enemy) {
  gameStats.enemiesKilled++;
  if (enemy.r > 15) gameStats.bossesKilled++;
  checkAchievements();
}

export function recordWaveCompleted() {
  gameStats.wavesCompleted++;
  gameStats.highestWave = Math.max(gameStats.highestWave, gameStats.wavesCompleted);
  checkAchievements();
}

export function recordPowerupCollected() {
  gameStats.powerupsCollected++;
  checkAchievements();
}

export function recordTowerBuilt(towerType) {
  gameStats.towersBuilt.add(towerType);
  checkAchievements();
}

export function recordAbilityUsed(abilityKey) {
  gameStats.abilitiesUsed.add(abilityKey);
  checkAchievements();
}

export function recordCoinsEarned(amount) {
  gameStats.totalCoinsEarned += amount;
  checkAchievements();
}

export function stepStats(dt) {
  gameStats.playtimeSeconds += dt;
}

export function saveStats() {
  try {
    localStorage.setItem('toasters-vs-loaves-achievements', JSON.stringify(achievements));
    localStorage.setItem('toasters-vs-loaves-stats', JSON.stringify({
      ...gameStats,
      towersBuilt: Array.from(gameStats.towersBuilt),
      abilitiesUsed: Array.from(gameStats.abilitiesUsed)
    }));
  } catch (e) {
    console.log('Could not save stats to localStorage');
  }
}

export function loadStats() {
  try {
    const savedAchievements = localStorage.getItem('toasters-vs-loaves-achievements');
    if (savedAchievements) {
      const loaded = JSON.parse(savedAchievements);
      for (let i = 0; i < achievements.length && i < loaded.length; i++) {
        achievements[i].unlocked = loaded[i].unlocked;
      }
    }
    
    const savedStats = localStorage.getItem('toasters-vs-loaves-stats');
    if (savedStats) {
      const loaded = JSON.parse(savedStats);
      Object.assign(gameStats, loaded);
      gameStats.towersBuilt = new Set(loaded.towersBuilt || []);
      gameStats.abilitiesUsed = new Set(loaded.abilitiesUsed || []);
    }
  } catch (e) {
    console.log('Could not load stats from localStorage');
  }
}

export function getUnlockedAchievements() {
  return achievements.filter(a => a.unlocked);
}

export function getAchievementProgress() {
  const total = achievements.length;
  const unlocked = achievements.filter(a => a.unlocked).length;
  return { unlocked, total, percentage: Math.round((unlocked / total) * 100) };
}
