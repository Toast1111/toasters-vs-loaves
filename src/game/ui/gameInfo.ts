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
    const waveStatusEl = document.getElementById('waveStatus');

    if (coinsEl) coinsEl.textContent = game.state.coins.toString();
    if (livesEl) livesEl.textContent = game.state.lives.toString();
    if (waveEl) waveEl.textContent = game.state.wave.toString();
    if (apEl) apEl.textContent = game.state.ap.toString();
    
    // Update wave status
    if (waveStatusEl) {
      if (game.state.paused) {
        waveStatusEl.textContent = 'PAUSED';
        waveStatusEl.style.backgroundColor = 'var(--bad)';
        waveStatusEl.style.cursor = 'default';
      } else if (game.state.waveInProgress) {
        waveStatusEl.textContent = `Wave ${game.state.wave} in progress...`;
        waveStatusEl.style.backgroundColor = 'var(--accent)';
        waveStatusEl.style.cursor = 'default';
      } else if (game.state.betweenWaves) {
        if (game.state.autoWave && game.state.autoWaveTimer > 0) {
          const timeLeft = Math.ceil(game.state.autoWaveTimer);
          waveStatusEl.textContent = `Next wave in ${timeLeft}s`;
          waveStatusEl.style.backgroundColor = 'var(--good)';
          waveStatusEl.style.cursor = 'default';
        } else {
          waveStatusEl.textContent = `Ready for Wave ${game.state.wave + 1} - Click to start`;
          waveStatusEl.style.backgroundColor = 'var(--wire)';
          waveStatusEl.style.cursor = 'pointer';
          waveStatusEl.onclick = () => {
            if (game.state.betweenWaves) {
              game.startWave();
            }
          };
        }
      }
    }
  }
};