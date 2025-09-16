// @ts-nocheck
import { getTowerBase, canUpgrade } from "../../content/entities/towers";

/**
 * Tower inspection component - handles selected tower details and upgrade interface
 */
export const TowerInspectUI = {
  game: null as any,

  /**
   * Initialize the tower inspection component
   */
  init(game: any) {
    this.game = game;
  },

  /**
   * Update the inspection panel with current selected tower
   */
  sync(game: any) {
    this.updateInspect(game);
  },

  /**
   * Update the tower inspection display
   */
  updateInspect(game: any) {
    const sec = document.getElementById('inspectSection');
    const box = document.getElementById('inspect');
    
    if (!sec || !box) return;

    const tower = game.getSelected();
    if (!tower) {
      sec.style.display = 'none';
      box.innerHTML = '';
      return;
    }

    sec.style.display = 'block';
    const base = getTowerBase(tower.type);
    
    // Build the inspection UI
    const statsHTML = this.buildStatsDisplay(tower);
    const upgradeHTML = this.buildUpgradeDisplay(tower, base, game);
    
    box.innerHTML = statsHTML + upgradeHTML;
    
    // Bind upgrade button events
    this.bindUpgradeButtons(box, tower, game);
  },

  /**
   * Build the tower stats display
   */
  buildStatsDisplay(tower: any): string {
    return `
      <div class="row"><b>${tower.name}</b><span class="small">ID ${tower.id}</span></div>
      <div class="keyline"></div>
      <div class="small">Range: ${tower.range.toFixed(0)} | Dmg: ${tower.damage.toFixed(0)} | Fire/s: ${tower.fireRate.toFixed(2)}${tower.pierce ? ` | Pierce: ${tower.pierce}` : ''}${tower.splash ? ` | Splash: ${tower.splash}` : ''}</div>
      <div class="keyline"></div>
    `;
  },

  /**
   * Build the upgrade paths display
   */
  buildUpgradeDisplay(tower: any, base: any, game: any): string {
    let upgradeHTML = '<div class="upgrade-paths">';
    
    for (let pathIndex = 0; pathIndex < 3; pathIndex++) {
      const path = base.upgradePaths[pathIndex];
      const currentTier = tower.upgradeTiers[pathIndex];
      const canUpgradeThis = canUpgrade(tower, pathIndex, currentTier) && currentTier < path.upgrades.length;
      const nextUpgrade = currentTier < path.upgrades.length ? path.upgrades[currentTier] : null;
      
      upgradeHTML += this.buildUpgradePath(path, currentTier, nextUpgrade, canUpgradeThis, pathIndex, tower, game);
    }
    
    upgradeHTML += '</div>';
    return upgradeHTML;
  },

  /**
   * Build a single upgrade path display
   */
  buildUpgradePath(path: any, currentTier: number, nextUpgrade: any, canUpgradeThis: boolean, pathIndex: number, tower: any, game: any): string {
    let pathHTML = `
      <div class="upgrade-path">
        <div class="path-header">
          <strong>${path.name}</strong>
          <span class="tier-indicator">${currentTier}/${path.upgrades.length}</span>
        </div>
        <div class="path-progress">
    `;
    
    // Show tier bubbles
    for (let tier = 0; tier < path.upgrades.length; tier++) {
      const isOwned = tier < currentTier;
      const isNext = tier === currentTier;
      const upgrade = path.upgrades[tier];
      
      const bubbleClass = isOwned ? 'tier-owned' : isNext ? 'tier-next' : 'tier-locked';
      pathHTML += `
        <div class="tier-bubble ${bubbleClass}" title="${upgrade.name}: ${upgrade.tip}">
          ${tier + 1}
        </div>
      `;
    }
    
    pathHTML += '</div>';
    
    // Upgrade button or status
    if (canUpgradeThis && nextUpgrade) {
      const canAfford = game.state.coins >= nextUpgrade.cost;
      pathHTML += `
        <div class="upgrade-info">
          <div class="upgrade-name">${nextUpgrade.name}</div>
          <div class="upgrade-tip">${nextUpgrade.tip}</div>
          <button class="btn upgrade-btn" data-path="${pathIndex}" ${!canAfford ? 'disabled' : ''}>
            Upgrade (${nextUpgrade.cost}c)
          </button>
        </div>
      `;
    } else if (currentTier >= path.upgrades.length) {
      pathHTML += '<div class="upgrade-info"><div class="maxed">Path Maxed</div></div>';
    } else {
      // Show why upgrade is blocked
      const blockReason = this.getUpgradeBlockReason(tower, pathIndex, currentTier, nextUpgrade, game);
      pathHTML += `<div class="upgrade-info"><div class="blocked">${blockReason}</div></div>`;
    }
    
    pathHTML += '</div>';
    return pathHTML;
  },

  /**
   * Get the reason why an upgrade is blocked
   */
  getUpgradeBlockReason(tower: any, pathIndex: number, currentTier: number, nextUpgrade: any, game: any): string {
    const nextTier = currentTier + 1;
    const pathsAt3Plus = tower.upgradeTiers.filter((tier: number) => tier >= 3).length;
    const thisPathAt3Plus = tower.upgradeTiers[pathIndex] >= 3;
    
    if (nextTier >= 3 && pathsAt3Plus > 0 && !thisPathAt3Plus) {
      return 'Only one path may exceed Tier 2';
    } else if (nextUpgrade && game.state.coins < nextUpgrade.cost) {
      return `Need ${nextUpgrade.cost} coins`;
    }
    
    return 'Upgrade not available';
  },

  /**
   * Bind upgrade button click events
   */
  bindUpgradeButtons(box: HTMLElement, tower: any, game: any) {
    const upgradeButtons = box.querySelectorAll('.upgrade-btn') as NodeListOf<HTMLButtonElement>;
    upgradeButtons.forEach(btn => {
      btn.onclick = () => {
        const pathIndex = parseInt(btn.getAttribute('data-path') || '0');
        game.upgradeTowerPath(tower, pathIndex);
      };
    });
  }
};