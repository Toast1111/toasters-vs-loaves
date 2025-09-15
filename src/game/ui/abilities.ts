// @ts-nocheck
import { getAbilityStatus } from "../abilities";

/**
 * Abilities component - handles special abilities display and management
 */
export const AbilitiesUI = {
  /**
   * Initialize the abilities component
   */
  init(game: any) {
    this.refresh();
  },

  /**
   * Refresh the abilities display with current status
   */
  refresh() {
    const display = document.getElementById('abilitiesDisplay');
    if (!display) return;

    const abilities = getAbilityStatus();
    
    let html = '<div class="hint">Hotkeys: Q, W, E, R. Abilities cost coins except Emergency Coins.</div>';
    
    for (const ability of abilities) {
      html += this.buildAbilityDisplay(ability);
    }
    
    display.innerHTML = html;
  },

  /**
   * Build the display for a single ability
   */
  buildAbilityDisplay(ability: any): string {
    const readyClass = ability.ready ? 'ready' : 'cooldown';
    const cooldownPercent = ability.ready ? 0 : (ability.cooldown / ability.maxCooldown) * 100;
    
    return `
      <div class="ability ${readyClass}">
        <div class="ability-info">
          <div><strong>${ability.name}</strong> ${ability.cost > 0 ? `(${ability.cost}c)` : '(Free)'}</div>
          <div class="small">${ability.description}</div>
          ${!ability.ready ? `<div class="cooldown-bar"><div class="cooldown-progress" style="width: ${cooldownPercent}%"></div></div>` : ''}
        </div>
        <div class="ability-key">${ability.hotkey}</div>
      </div>
    `;
  }
};