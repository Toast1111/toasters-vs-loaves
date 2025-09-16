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
    
    for (let i = 0; i < TOWER_TYPES.length; i++) {
      const tower = TOWER_TYPES[i];
      const card = document.createElement('div');
      card.className = 'card';
      card.id = `tower-card-${i}`;
      
      // Check if this tower is currently selected for placement
      const isSelected = game.state.placing && game.state.placing.type === tower.type;
      const canAfford = game.state.coins >= tower.cost;
      
      // Add appropriate classes
      if (isSelected) {
        card.classList.add('selected');
      }
      if (!canAfford) {
        card.classList.add('insufficient-funds');
      }
      
      card.innerHTML = `
        <div class="row">
          <b>${tower.name}</b>
          <span class="badge ${!canAfford ? 'insufficient' : ''}">${tower.cost}c</span>
        </div>
        <div class="small">${tower.desc}</div>
        <button class="placeBtn btn ${isSelected ? 'selected' : ''}" ${!canAfford ? 'disabled' : ''}>
          ${isSelected ? 'Selected - Click to Place' : 'Select Tower'}
        </button>
      `;
      
      const placeBtn = card.querySelector('.placeBtn') as HTMLButtonElement;
      placeBtn.onclick = () => this.handleTowerSelection(game, tower, i);
      
      catalogEl.appendChild(card);
    }
  },

  /**
   * Handle tower selection for placement
   */
  handleTowerSelection(game: any, tower: any, index: number) {
    if (game.state.coins < tower.cost) {
      if (this.logCallback) {
        this.logCallback(`Need ${tower.cost}c for ${tower.name}.`);
      }
      return;
    }
    
    // If already selected, deselect it
    if (game.state.placing && game.state.placing.type === tower.type) {
      game.state.placing = null;
      if (this.logCallback) {
        this.logCallback(`${tower.name} deselected.`);
      }
    } else {
      // Select this tower for placement
      game.state.placing = tower;
      if (this.logCallback) {
        this.logCallback(`${tower.name} selected. Click on the counter to place it.`);
      }
    }
    
    // Refresh the catalog to update visual state
    this.refresh(game);
  },

  /**
   * Clear tower selection and refresh catalog
   */
  clearSelection(game: any) {
    game.state.placing = null;
    this.refresh(game);
  }
};