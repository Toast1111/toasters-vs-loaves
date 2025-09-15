// @ts-nocheck

/**
 * Game info display component - handles coins, lives, wave, and AP display
 */
export const GameInfoUI = {
  /**
   * Initialize the game info component
   */
  init(game: any) {
    // No special initialization needed for game info display
  },

  /**
   * Update all game info displays with current values
   */
  sync(game: any) {
    const coinsEl = document.getElementById('coins');
    const livesEl = document.getElementById('lives');
    const waveEl = document.getElementById('wave');
    const apEl = document.getElementById('ap');

    if (coinsEl) coinsEl.textContent = game.state.coins.toString();
    if (livesEl) livesEl.textContent = game.state.lives.toString();
    if (waveEl) waveEl.textContent = game.state.wave.toString();
    if (apEl) apEl.textContent = game.state.ap.toString();
  }
};