// @ts-nocheck
import { TOWER_TYPES } from "../towers/index";

/**
 * Tower catalog component - handles tower selection and placement interface
 */
export const TowerCatalogUI = {
  game: null as any,
  logCallback: null as any,

  /**
   * Initialize the tower catalog component
   */
  init(game: any) {
    this.game = game;
    this.refresh(game);
  },

  /**
   * Set the logging callback function
   */
  setLogCallback(logFn: any) {
    this.logCallback = logFn;
  },

  /**
   * Refresh the tower catalog with current towers and pricing
   */
  refresh(game: any) {
    const catalogEl = document.getElementById('catalog');
    if (!catalogEl) return;

    catalogEl.innerHTML = '';
    
    for (const tower of TOWER_TYPES) {
      const card = document.createElement('div');
      card.className = 'card';
      
      card.innerHTML = `
        <div class="row">
          <b>${tower.name}</b>
          <span class="badge">${tower.cost}c</span>
        </div>
        <div class="small">${tower.desc}</div>
        <button class="placeBtn btn">Place</button>
      `;
      
      const placeBtn = card.querySelector('.placeBtn') as HTMLButtonElement;
      placeBtn.onclick = () => this.handleTowerSelection(game, tower);
      
      catalogEl.appendChild(card);
    }
  },

  /**
   * Handle tower selection for placement
   */
  handleTowerSelection(game: any, tower: any) {
    if (game.state.coins < tower.cost) {
      if (this.logCallback) {
        this.logCallback(`Need ${tower.cost}c for ${tower.name}.`);
      }
      return;
    }
    
    game.state.placing = tower;
  }
};