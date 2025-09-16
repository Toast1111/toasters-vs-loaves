// @ts-nocheck
import { TECHS } from "../../content/tech";

/**
 * Tech tree component - handles technology research interface
 */
export const TechTreeUI = {
  game: null as any,
  logCallback: null as any,
  syncCallback: null as any,
  updateInspectCallback: null as any,

  /**
   * Initialize the tech tree component
   */
  init(game: any) {
    this.game = game;
    this.refresh(game);
  },

  /**
   * Set callback functions for inter-component communication
   */
  setCallbacks(logFn: any, syncFn: any, updateInspectFn: any) {
    this.logCallback = logFn;
    this.syncCallback = syncFn;
    this.updateInspectCallback = updateInspectFn;
  },

  /**
   * Refresh the tech tree display with current technologies
   */
  refresh(game: any) {
    const techEl = document.getElementById('tech');
    if (!techEl) return;

    techEl.innerHTML = '';
    
    for (const tech of TECHS) {
      const node = document.createElement('div');
      node.className = 'tech';
      
      node.innerHTML = `
        <b>${tech.name}</b>
        <div class="small">${tech.desc}</div>
        <button class="buy btn small">Buy (${tech.cost} AP)</button>
      `;
      
      const buyBtn = node.querySelector('.buy') as HTMLButtonElement;
      buyBtn.onclick = () => this.handleTechPurchase(game, tech);
      
      techEl.appendChild(node);
    }
  },

  /**
   * Handle technology purchase
   */
  handleTechPurchase(game: any, tech: any) {
    if (game.state.ap < tech.cost) {
      if (this.logCallback) {
        this.logCallback('Not enough AP. Survive more waves!');
      }
      return;
    }
    
    // Purchase the technology
    game.state.ap -= tech.cost;
    
    // Apply the technology effect
    tech.action(game);
    
    // Log the purchase
    if (this.logCallback) {
      this.logCallback(`Tech unlocked: ${tech.name}`);
    }
    
    // Refresh displays
    if (this.syncCallback) {
      this.syncCallback(game);
    }
    
    this.refresh(game);
    
    // Update tower inspect if needed
    if (this.updateInspectCallback) {
      this.updateInspectCallback(game);
    }
  }
};