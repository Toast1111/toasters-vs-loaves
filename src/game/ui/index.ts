// @ts-nocheck
import { GameInfoUI } from './gameInfo';
import { TowerCatalogUI } from './towerCatalog';
import { TowerInspectUI } from './towerInspect';
import { TowerPopupUI } from './towerPopup';
import { TechTreeUI } from './techTree';
import { AbilitiesUI } from './abilities';
import { AchievementsUI } from './achievements';
import { PowerupsUI } from './powerups';
import { EventLogUI } from './eventLog';
import { FloatingTextUI } from './floatingText';

/**
 * Main UI manager that coordinates all UI components
 */
export const UI = {
  // Sub-components
  gameInfo: GameInfoUI,
  towerCatalog: TowerCatalogUI,
  towerInspect: TowerInspectUI,
  towerPopup: TowerPopupUI,
  techTree: TechTreeUI,
  abilities: AbilitiesUI,
  achievements: AchievementsUI,
  powerups: PowerupsUI,
  eventLog: EventLogUI,
  floatingText: FloatingTextUI,

  /**
   * Initialize all UI components and bind event handlers
   */
  bind(game: any) {
    // Initialize controls
    document.getElementById('sellBtn')!.onclick = () => game.sellSelected();
    document.getElementById('rangeToggle')!.onchange = (e: any) => { 
      game.state.showRanges = e.target.checked; 
    };

    // Initialize all components
    this.gameInfo.init(game);
    this.towerCatalog.init(game);
    this.towerInspect.init(game);
    this.towerPopup.init(game);
    this.techTree.init(game);
    this.abilities.init(game);
    this.achievements.init(game);
    this.powerups.init(game);
    this.eventLog.init(game);
    this.floatingText.init(game);

    // Set up inter-component communication
    this.towerCatalog.setLogCallback((msg: string) => this.log(msg));
    this.techTree.setCallbacks(
      (msg: string) => this.log(msg),
      (game: any) => this.sync(game),
      (game: any) => this.towerInspect.updateInspect(game)
    );

    // Perform initial sync
    this.sync(game);
  },

  /**
   * Update all UI components with current game state
   */
  sync(game: any) {
    this.gameInfo.sync(game);
    this.powerups.sync(game);
    this.towerInspect.sync(game);
    this.towerCatalog.refresh(game); // Update tower purchase buttons based on current coins
    this.updateSellButton(game);
  },

  /**
   * Update the sell button state
   */
  updateSellButton(game: any) {
    const sellBtn = document.getElementById('sellBtn');
    if (sellBtn) {
      const selected = game.getSelected();
      if (selected) {
        const sellValue = Math.floor(selected.totalCost * 0.8);
        sellBtn.textContent = `Sell for ${sellValue}c`;
        sellBtn.disabled = false;
      } else {
        sellBtn.textContent = 'Sell Tower (No Selection)';
        sellBtn.disabled = true;
      }
    }
  },

  /**
   * Log a message to the event log
   */
  log(msg: string) {
    this.eventLog.log(msg);
  },

  /**
   * Create floating text at specified coordinates
   */
  float(game: any, x: number, y: number, str: string, isBad: boolean = false) {
    this.floatingText.float(game, x, y, str, isBad);
  },

  /**
   * Refresh all dynamic UI elements
   */
  refreshAll(game: any) {
    this.towerCatalog.refresh(game);
    this.techTree.refresh(game);
    this.abilities.refresh();
    this.achievements.refresh();
  },

  /**
   * Individual refresh methods for compatibility
   */
  refreshCatalog(game: any) {
    this.towerCatalog.refresh(game);
  },

  refreshTech(game: any) {
    this.techTree.refresh(game);
  },

  refreshAbilities() {
    this.abilities.refresh();
  },

  refreshAchievements() {
    this.achievements.refresh();
  },

  updateInspect(game: any) {
    this.towerInspect.updateInspect(game);
  },

  updatePowerupDisplay() {
    this.powerups.updatePowerupDisplay();
  },

  /**
   * Show the tower upgrade popup
   */
  showTowerPopup(tower: any) {
    this.towerPopup.show(tower);
  },

  /**
   * Hide the tower upgrade popup
   */
  hideTowerPopup() {
    this.towerPopup.hide();
  },

  /**
   * Check if the tower popup is open
   */
  isTowerPopupOpen(): boolean {
    return this.towerPopup.isOpen();
  }
};