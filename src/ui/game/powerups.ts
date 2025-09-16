// @ts-nocheck
import { activePowerups, POWERUP_TYPES } from "../../systems/powerups";

/**
 * Powerups component - handles active powerups display
 */
export const PowerupsUI = {
  /**
   * Initialize the powerups component
   */
  init(game: any) {
    // No special initialization needed
  },

  /**
   * Update the powerups display with current active powerups
   */
  sync(game: any) {
    this.updatePowerupDisplay();
  },

  /**
   * Update the powerups display
   */
  updatePowerupDisplay() {
    const display = document.getElementById('powerupDisplay');
    const content = document.getElementById('activePowerups');
    
    if (!display || !content) return;

    if (activePowerups.length === 0) {
      display.style.display = 'none';
    } else {
      display.style.display = 'block';
      const powerupTexts = activePowerups.map(powerup => {
        const data = POWERUP_TYPES[powerup.type];
        return `<span style="color: ${data.color}">${data.name} (${Math.ceil(powerup.duration)}s)</span>`;
      });
      content.innerHTML = powerupTexts.join(', ');
    }
  }
};