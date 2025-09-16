// @ts-nocheck
import { getTowerBase, canUpgrade } from "../../content/entities/towers";

/**
 * Tower upgrade popup component - handles tower upgrade and sell interface in a modal popup
 */
export const TowerPopupUI = {
  game: null as any,
  isVisible: false,
  currentTower: null as any,

  /**
   * Initialize the tower popup component
   */
  init(game: any) {
    this.game = game;
    this.bindEvents();
  },

  /**
   * Bind popup events
   */
  bindEvents() {
    const popup = document.getElementById('towerUpgradePopup');
    const closeBtn = document.getElementById('closePopup');
    const sellBtn = document.getElementById('popupSellBtn');

    if (closeBtn) {
      closeBtn.onclick = () => this.hide();
    }

    if (sellBtn) {
      sellBtn.onclick = () => this.sellTower();
    }

    // Close popup when clicking backdrop
    if (popup) {
      popup.onclick = (e) => {
        if (e.target === popup) {
          this.hide();
        }
      };
    }

    // ESC key to close popup
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible) {
        this.hide();
      }
    });
  },

  /**
   * Show the popup for a specific tower
   */
  show(tower: any) {
    if (!tower) return;

    this.currentTower = tower;
    this.isVisible = true;
    
    const popup = document.getElementById('towerUpgradePopup');
    if (popup) {
      popup.style.display = 'flex';
      this.updateContent();
    }
  },

  /**
   * Hide the popup
   */
  hide() {
    this.isVisible = false;
    this.currentTower = null;
    
    const popup = document.getElementById('towerUpgradePopup');
    if (popup) {
      popup.style.display = 'none';
    }
  },

  /**
   * Update popup content with current tower data
   */
  updateContent() {
    if (!this.currentTower) return;

    const tower = this.currentTower;
    const base = getTowerBase(tower.type);

    // Update tower name
    const nameEl = document.getElementById('popupTowerName');
    if (nameEl) {
      nameEl.textContent = `${tower.name} (ID: ${tower.id})`;
    }

    // Update tower stats
    this.updateStats(tower);

    // Update upgrade paths
    this.updateUpgradePaths(tower, base);

    // Update sell button
    this.updateSellButton(tower);
  },

  /**
   * Update the tower stats display
   */
  updateStats(tower: any) {
    const statsEl = document.getElementById('popupTowerStats');
    if (!statsEl) return;

    statsEl.innerHTML = `
      <div class="popup-tower-stats">
        <div class="stat-row">
          <span class="stat-label">Range:</span>
          <span class="stat-value">${tower.range.toFixed(0)}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Damage:</span>
          <span class="stat-value">${tower.damage.toFixed(0)}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Fire Rate:</span>
          <span class="stat-value">${tower.fireRate.toFixed(2)}/s</span>
        </div>
        ${tower.pierce ? `
        <div class="stat-row">
          <span class="stat-label">Pierce:</span>
          <span class="stat-value">${tower.pierce}</span>
        </div>
        ` : ''}
        ${tower.splash ? `
        <div class="stat-row">
          <span class="stat-label">Splash:</span>
          <span class="stat-value">${tower.splash}</span>
        </div>
        ` : ''}
      </div>
    `;
  },

  /**
   * Update the upgrade paths display
   */
  updateUpgradePaths(tower: any, base: any) {
    const pathsEl = document.getElementById('popupUpgradePaths');
    if (!pathsEl) return;

    let upgradeHTML = '<div class="upgrade-paths">';
    
    for (let pathIndex = 0; pathIndex < 3; pathIndex++) {
      const path = base.upgradePaths[pathIndex];
      const currentTier = tower.upgradeTiers[pathIndex];
      const canUpgradeThis = canUpgrade(tower, pathIndex, currentTier) && currentTier < path.upgrades.length;
      const nextUpgrade = currentTier < path.upgrades.length ? path.upgrades[currentTier] : null;
      
      upgradeHTML += this.buildUpgradePath(path, currentTier, nextUpgrade, canUpgradeThis, pathIndex, tower);
    }
    
    upgradeHTML += '</div>';
    pathsEl.innerHTML = upgradeHTML;

    // Bind upgrade button events
    this.bindUpgradeButtons(pathsEl, tower);
  },

  /**
   * Build a single upgrade path display
   */
  buildUpgradePath(path: any, currentTier: number, nextUpgrade: any, canUpgradeThis: boolean, pathIndex: number, tower: any): string {
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
      const canAfford = this.game.state.coins >= nextUpgrade.cost;
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
      const blockReason = this.getUpgradeBlockReason(tower, pathIndex, currentTier, nextUpgrade);
      pathHTML += `<div class="upgrade-info"><div class="blocked">${blockReason}</div></div>`;
    }
    
    pathHTML += '</div>';
    return pathHTML;
  },

  /**
   * Get the reason why an upgrade is blocked
   */
  getUpgradeBlockReason(tower: any, pathIndex: number, currentTier: number, nextUpgrade: any): string {
    const nextTier = currentTier + 1;
    const pathsAt3Plus = tower.upgradeTiers.filter((tier: number) => tier >= 3).length;
    const thisPathAt3Plus = tower.upgradeTiers[pathIndex] >= 3;
    
    if (nextTier >= 3 && pathsAt3Plus > 0 && !thisPathAt3Plus) {
      return 'Only one path may exceed Tier 2';
    } else if (nextUpgrade && this.game.state.coins < nextUpgrade.cost) {
      return `Need ${nextUpgrade.cost} coins`;
    }
    
    return 'Upgrade not available';
  },

  /**
   * Bind upgrade button click events
   */
  bindUpgradeButtons(container: HTMLElement, tower: any) {
    const upgradeButtons = container.querySelectorAll('.upgrade-btn') as NodeListOf<HTMLButtonElement>;
    upgradeButtons.forEach(btn => {
      btn.onclick = () => {
        const pathIndex = parseInt(btn.getAttribute('data-path') || '0');
        this.game.upgradeTowerPath(tower, pathIndex);
        // Update the popup content after upgrade
        this.updateContent();
      };
    });
  },

  /**
   * Update the sell button
   */
  updateSellButton(tower: any) {
    const sellBtn = document.getElementById('popupSellBtn');
    if (sellBtn) {
      const sellValue = Math.floor(tower.totalCost * 0.8);
      sellBtn.textContent = `Sell for ${sellValue}c`;
    }
  },

  /**
   * Sell the current tower
   */
  sellTower() {
    if (this.currentTower && this.game) {
      this.game.sellSelected();
      this.hide();
    }
  },

  /**
   * Check if popup is currently visible
   */
  isOpen(): boolean {
    return this.isVisible;
  }
};