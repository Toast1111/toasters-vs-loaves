// @ts-nocheck
import { createWikiModal } from './wiki';
import { createTechModal } from './techTree';
import { menuMusic } from '../../audio/menuMusic';

export enum GameState {
  TITLE_SCREEN = 'title_screen',
  KITCHEN_HQ = 'kitchen_hq', 
  MAP_SELECT = 'map_select',
  DIFFICULTY_SELECT = 'difficulty_select',
  IN_GAME = 'in_game',
  PAUSED = 'paused',
  GAME_OVER = 'game_over',
  VICTORY = 'victory'
}

export interface MapData {
  id: string;
  name: string;
  description: string;
  theme: string;
  layout: string; // Description of the map layout
  unlocked: boolean;
  bestWave?: { [difficulty: string]: number }; // Best wave reached per difficulty
  preview?: string; // Map preview image/description
  specialFeatures?: string[]; // Unique map features
}

export interface DifficultySettings {
  id: string;
  name: string;
  description: string;
  color: string;
  startingCoins: number;
  startingLives: number;
  enemyHealthMultiplier: number;
  enemySpeedMultiplier: number;
  rewardMultiplier: number;
  waveIntensityMultiplier: number;
}

export class MenuManager {
  private currentState: GameState = GameState.TITLE_SCREEN;
  private previousState: GameState | null = null;
  private canvas: HTMLCanvasElement;
  public gameInstance: any = null;
  private menuContainer: HTMLElement;
  private selectedMap: MapData | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupMenuContainer();
    this.showTitleScreen();
  }

  private setupMenuContainer() {
    // Hide the sidebar initially (only show during gameplay)
    const sidebar = document.querySelector('.side') as HTMLElement;
    if (sidebar) sidebar.style.display = 'none';
    
    // Create menu overlay container
    this.menuContainer = document.createElement('div');
    this.menuContainer.id = 'menuContainer';
    this.menuContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 500;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    // Insert after canvas
    this.canvas.parentElement.appendChild(this.menuContainer);
  }

  getCurrentState(): GameState {
    return this.currentState;
  }

  transition(newState: GameState, data?: any) {
    this.previousState = this.currentState;
    this.currentState = newState;

    // Toggle layout mode based on state
    const wrapper = document.querySelector('.wrap');
    if (wrapper) {
      if ([GameState.TITLE_SCREEN, GameState.KITCHEN_HQ, GameState.MAP_SELECT, GameState.DIFFICULTY_SELECT, GameState.GAME_OVER, GameState.VICTORY].includes(newState)) {
        wrapper.classList.add('menu-mode');
      } else {
        wrapper.classList.remove('menu-mode');
      }
    }
    
    this.clearMenuContainer();
    
    // Audio control: play during menu states, pause (fade) during in-game
    if ([GameState.TITLE_SCREEN, GameState.KITCHEN_HQ, GameState.MAP_SELECT, GameState.DIFFICULTY_SELECT, GameState.GAME_OVER, GameState.VICTORY].includes(newState)) {
      menuMusic.playIfMenu();
    } else if (newState === GameState.IN_GAME) {
      menuMusic.fadeOutAndPause(800);
    }

    switch (newState) {
      case GameState.TITLE_SCREEN:
        this.showTitleScreen();
        break;
      case GameState.KITCHEN_HQ:
        this.showKitchenHQ();
        break;
      case GameState.MAP_SELECT:
        this.showMapSelect();
        break;
      case GameState.DIFFICULTY_SELECT:
        this.showDifficultySelect();
        break;
      case GameState.IN_GAME:
        this.startGame(data);
        break;
      case GameState.PAUSED:
        this.showPauseMenu();
        break;
      case GameState.GAME_OVER:
        this.showGameOver();
        break;
      case GameState.VICTORY:
        this.showVictory();
        break;
    }
  }

  goBack() {
    if (this.previousState) {
      this.transition(this.previousState);
    }
  }

  private clearMenuContainer() {
    this.menuContainer.innerHTML = '';
    this.menuContainer.style.display = 'flex';
  }

  private hideMenuContainer() {
    this.menuContainer.style.display = 'none';
  }

  private showTitleScreen() {
    const titleScreen = document.createElement('div');
    titleScreen.className = 'title-screen';
    titleScreen.innerHTML = `
      <div class="title-content">
        <h1 class="game-title">🍞 TOASTERS vs LOAVES 🔥</h1>
        <div class="title-subtitle">The Ultimate Kitchen Defense Experience</div>
        <div class="title-artwork">
          <div class="toaster-icon">📱</div>
          <div class="vs-text">VS</div>
          <div class="bread-icon">🍞</div>
        </div>
        <button class="menu-btn primary" id="enterGame">Enter Kitchen HQ</button>
        <div class="title-footer">
          <div class="version">v1.0.0 - Modular Edition</div>
        </div>
      </div>
    `;
    
    this.menuContainer.appendChild(titleScreen);
    
    document.getElementById('enterGame').onclick = () => {
      this.transition(GameState.KITCHEN_HQ);
    };
    // Initialize music system (gesture captured by button click too)
    menuMusic.init();
  }

  private showKitchenHQ() {
    const kitchenHQ = document.createElement('div');
    kitchenHQ.className = 'kitchen-hq';
    kitchenHQ.innerHTML = `
      <div class="hq-content">
        <div class="hq-header">
          <h1>🏠 Kitchen Headquarters</h1>
          <div class="hq-subtitle">Command Center for Your Culinary Defense</div>
        </div>
        
        <div class="hq-grid">
          <div class="hq-card play-card">
            <div class="card-icon">🎮</div>
            <h3>Play Maps</h3>
            <p>Choose your battlefield and difficulty for endless wave survival!</p>
            <button class="menu-btn primary" id="playLevels">Select Map</button>
          </div>
          
          <div class="hq-card wiki-card">
            <div class="card-icon">📚</div>
            <h3>Loaf Encyclopedia</h3>
            <p>Study enemy bread types, their weaknesses, and battle strategies</p>
            <button class="menu-btn secondary" id="showWiki">Browse Wiki</button>
          </div>
          
          <div class="hq-card tech-card">
            <div class="card-icon">🔬</div>
            <h3>Global Tech Tree</h3>
            <p>Unlock permanent upgrades for your toaster arsenal</p>
            <button class="menu-btn secondary" id="showTech">View Tech</button>
          </div>
          
          <div class="hq-card settings-card">
            <div class="card-icon">⚙️</div>
            <h3>Kitchen Settings</h3>
            <p>Adjust audio, graphics, and control preferences</p>
            <button class="menu-btn secondary" id="showSettings">Settings</button>
          </div>
        </div>
        
        <div class="hq-stats">
          <div class="stat-item">
            <span class="stat-label">Total AP Earned:</span>
            <span class="stat-value">0</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Maps Unlocked:</span>
            <span class="stat-value">2/6</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Achievements:</span>
            <span class="stat-value">0/25</span>
          </div>
        </div>
      </div>
    `;
    
    this.menuContainer.appendChild(kitchenHQ);
    
    document.getElementById('playLevels').onclick = () => {
      this.transition(GameState.MAP_SELECT);
    };
    
    document.getElementById('showWiki').onclick = () => {
      this.showWikiModal();
    };
    
    document.getElementById('showTech').onclick = () => {
      this.showTechModal();
    };
    
    document.getElementById('showSettings').onclick = () => {
      this.showSettingsModal();
    };
  }

  private showMapSelect() {
    const maps = this.getMapData();
    
    const mapSelect = document.createElement('div');
    mapSelect.className = 'map-select';
    mapSelect.innerHTML = `
      <div class="map-content">
        <div class="map-header">
          <button class="back-btn" id="backToHQ">← Back to HQ</button>
          <h1>🗺️ Map Selection</h1>
          <div class="map-subtitle">Choose Your Battlefield</div>
        </div>
        
        <div class="maps-grid">
          ${maps.map(map => `
            <div class="map-card ${map.unlocked ? 'unlocked' : 'locked'}" data-map="${map.id}">
              <div class="map-preview">
                <div class="map-theme">${map.theme}</div>
              </div>
              <div class="map-info">
                <h3>${map.name}</h3>
                <p>${map.description}</p>
                <div class="map-layout">
                  <span class="layout-info">📋 ${map.layout}</span>
                </div>
                ${map.specialFeatures ? `
                  <div class="special-features">
                    ${map.specialFeatures.map(feature => 
                      `<span class="feature-tag">✨ ${feature}</span>`
                    ).join('')}
                  </div>
                ` : ''}
                ${map.bestWave && Object.keys(map.bestWave).length > 0 ? `
                  <div class="best-waves">
                    <span class="best-label">Best Waves:</span>
                    ${Object.entries(map.bestWave).map(([diff, wave]) => 
                      `<span class="wave-record">${diff}: ${wave}</span>`
                    ).join('')}
                  </div>
                ` : ''}
              </div>
              <div class="map-status">
                ${map.unlocked ? '🔓' : '🔒'}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="map-info-panel">
          <h3>🏗️ Infinite Wave Defense</h3>
          <p>Each map features endless waves of increasingly challenging bread! Survive as long as you can and set new records.</p>
          <p><strong>💡 Tip:</strong> Different maps have unique layouts and features that affect strategy!</p>
        </div>
      </div>
    `;
    
    this.menuContainer.appendChild(mapSelect);
    
    document.getElementById('backToHQ').onclick = () => {
      this.transition(GameState.KITCHEN_HQ);
    };
    
    // Add click handlers for unlocked maps
    maps.forEach(map => {
      if (map.unlocked) {
        const card = mapSelect.querySelector(`[data-map="${map.id}"]`);
        card.onclick = () => {
          this.selectedMap = map;
          this.transition(GameState.DIFFICULTY_SELECT);
        };
      }
    });
  }

  private showDifficultySelect() {
    if (!this.selectedMap) {
      this.transition(GameState.MAP_SELECT);
      return;
    }

    const difficulties = this.getDifficultySettings();
    
    const difficultySelect = document.createElement('div');
    difficultySelect.className = 'difficulty-select';
    difficultySelect.innerHTML = `
      <div class="difficulty-content">
        <div class="difficulty-header">
          <button class="back-btn" id="backToMaps">← Back to Maps</button>
          <div class="selected-map-info">
            <h1>⚔️ Select Difficulty</h1>
            <div class="selected-map-name">Map: ${this.selectedMap.name}</div>
          </div>
        </div>
        
        <div class="difficulties-grid">
          ${difficulties.map(diff => `
            <div class="difficulty-card" data-difficulty="${diff.id}">
              <div class="difficulty-icon" style="background: ${diff.color}20; color: ${diff.color};">
                ${this.getDifficultyIcon(diff.id)}
              </div>
              <div class="difficulty-info">
                <h3 style="color: ${diff.color};">${diff.name}</h3>
                <p>${diff.description}</p>
                
                <div class="difficulty-stats">
                  <div class="stat-grid">
                    <div class="stat-item">
                      <span class="stat-label">Starting Coins:</span>
                      <span class="stat-value">${diff.startingCoins}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Starting Lives:</span>
                      <span class="stat-value">${diff.startingLives}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Enemy Health:</span>
                      <span class="stat-value">${diff.enemyHealthMultiplier}x</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Enemy Speed:</span>
                      <span class="stat-value">${diff.enemySpeedMultiplier}x</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Rewards:</span>
                      <span class="stat-value">${diff.rewardMultiplier}x</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Wave Intensity:</span>
                      <span class="stat-value">${diff.waveIntensityMultiplier}x</span>
                    </div>
                  </div>
                </div>
                
                ${this.selectedMap.bestWave && this.selectedMap.bestWave[diff.id] ? `
                  <div class="personal-best">
                    🏆 Personal Best: Wave ${this.selectedMap.bestWave[diff.id]}
                  </div>
                ` : ''}
                
                <button class="start-game-btn" style="background: linear-gradient(135deg, ${diff.color}, ${diff.color}dd);">
                  Start Game
                </button>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="infinite-wave-info">
          <h3>🌊 Infinite Wave System</h3>
          <p>Waves become progressively harder with more enemies, new bread types, and increased stats. How far can you survive?</p>
        </div>
      </div>
    `;
    
    this.menuContainer.appendChild(difficultySelect);
    
    document.getElementById('backToMaps').onclick = () => {
      this.transition(GameState.MAP_SELECT);
    };
    
    // Add click handlers for difficulty cards
    difficulties.forEach(diff => {
      const card = difficultySelect.querySelector(`[data-difficulty="${diff.id}"]`);
      const button = card.querySelector('.start-game-btn');
      button.onclick = () => {
        this.transition(GameState.IN_GAME, { map: this.selectedMap, difficulty: diff });
      };
    });
  }

  private startGame(gameData: { map: MapData; difficulty: DifficultySettings }) {
    this.hideMenuContainer();
    
    // Show the sidebar during gameplay
    const sidebar = document.querySelector('.side') as HTMLElement;
    if (sidebar) sidebar.style.display = 'flex';
    
    // Show exit button
    const exitBtn = document.getElementById('exitGameBtn');
    if (exitBtn) {
      exitBtn.style.display = 'block';
      exitBtn.onclick = () => this.showExitConfirm();
    }
    
    // Import and initialize game dynamically
    import('../../core/Game').then(({ Game }) => {
      // Clean up any existing game instance and its global state
      if (this.gameInstance) {
        Game.cleanupGlobals();
      }
      
      const ctx = this.canvas.getContext('2d');
      const levelId = (gameData && gameData.map && gameData.map.id) || 'training_kitchen';
      this.gameInstance = new Game(this.canvas, ctx, levelId);
      
      // Configure game with map and difficulty data
      if (gameData) {
        this.gameInstance.state.coins = gameData.difficulty.startingCoins;
        this.gameInstance.state.lives = gameData.difficulty.startingLives;
        this.gameInstance.state.currentMap = gameData.map;
        this.gameInstance.state.currentDifficulty = gameData.difficulty;
        this.gameInstance.state.infiniteMode = true;
        this.gameInstance.state.currentWave = 0;
        // Reset wave counter and ensure clean state
        this.gameInstance.state.wave = 0;
        this.gameInstance.state.betweenWaves = true;
        this.gameInstance.state.waveInProgress = false;
      }
      
      this.gameInstance.init();
      this.startGameLoop();
    });
  }

  private startGameLoop() {
    const frame = (now: number) => {
      if (this.currentState === GameState.IN_GAME && this.gameInstance) {
        const dt = this.gameInstance.stepTime(now);
        this.gameInstance.update(dt);
        this.gameInstance.draw();
        requestAnimationFrame(frame);
      }
    };
    requestAnimationFrame(frame);
  }

  exitGame() {
    // Perform deep cleanup of current game instance and global registries
    if (this.gameInstance) {
      try {
        // Clear global arrays imported by subsystems
        // Dynamically import to avoid retaining references earlier
        import('../../content/entities/breads/breads').then(mod => { if (mod.breads) mod.breads.length = 0; });
        import('../../systems/projectiles/projectiles').then(mod => { if (mod.projectiles) mod.projectiles.length = 0; });
        import('../../systems/particles/particles').then(mod => { if (mod.particles) mod.particles.length = 0; if (mod.damageNumbers) mod.damageNumbers.length = 0; });
        import('../../systems/effects/effects').then(mod => { if (mod.heatZones) mod.heatZones.length = 0; });
        import('../../systems/powerups/powerups').then(mod => { if (mod.powerups) mod.powerups.length = 0; if (mod.activePowerups) mod.activePowerups.length = 0; });
      } catch (e) {
        console.warn('Cleanup error:', e);
      }
      // Clear canvas so last frame isn't visible behind menus
      try {
        const ctx = this.canvas.getContext('2d');
        ctx && ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      } catch {}
    }
    this.gameInstance = null;
    
    // Hide exit button
    const exitBtn = document.getElementById('exitGameBtn');
    if (exitBtn) exitBtn.style.display = 'none';
    
    // Hide the sidebar when in menus
    const sidebar = document.querySelector('.side') as HTMLElement;
    if (sidebar) sidebar.style.display = 'none';
    
    this.transition(GameState.KITCHEN_HQ);
  }

  private showExitConfirm() {
    // Prevent stacking multiple modals
    if (document.getElementById('confirmExitModal')) return;
    const modal = document.createElement('div');
    modal.id = 'confirmExitModal';
    modal.style.cssText = `
      position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.55); backdrop-filter: blur(4px); z-index: 1200; animation: modalFadeIn 0.2s ease;
    `;
    modal.innerHTML = `
      <div style="background: var(--panel); border:1px solid #29293f; border-radius:16px; width:90%; max-width:420px; padding:28px; box-shadow:0 12px 32px rgba(0,0,0,0.5);">
        <h2 style="margin:0 0 10px;font-size:22px;color:var(--accent);font-weight:800;">Return to Kitchen HQ?</h2>
        <p style="margin:0 0 18px;line-height:1.4;color:var(--muted);font-size:14px;">Leaving now will end this run. All towers, waves, and temporary effects will be lost. Persistent unlocks & achievements are already saved.</p>
        <div style="display:flex; gap:12px; justify-content:flex-end;">
          <button id="cancelExit" class="menu-btn" style="background:var(--panel2);border:1px solid #2d2d45;">Cancel</button>
          <button id="confirmExit" class="menu-btn primary" style="background:linear-gradient(135deg,var(--bad),#ff5555);color:#fff;border:none;">Yes, Exit</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    (modal.querySelector('#cancelExit') as HTMLElement).onclick = () => modal.remove();
    (modal.querySelector('#confirmExit') as HTMLElement).onclick = () => { modal.remove(); this.exitGame(); };
  }

  private showPauseMenu() {
    // Implementation for pause overlay
  }

  private showGameOver() {
    // Implementation for game over screen
  }

  private showVictory() {
    // Implementation for victory screen
  }

  private showWikiModal() {
    const modal = createWikiModal();
    document.body.appendChild(modal);
  }

  private showTechModal() {
    const modal = createTechModal();
    document.body.appendChild(modal);
  }

  private showSettingsModal() {
    const existing = document.getElementById('settingsModal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'settingsModal';
    modal.style.cssText = `position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:1200;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);`;
    const storedScale = parseFloat(localStorage.getItem('tvsl_glowScale') || '1');
    if (!isNaN(storedScale)) document.documentElement.style.setProperty('--title-glow-scale', storedScale.toString());
    const volPct = (menuMusic.getVolumePercent && menuMusic.getVolumePercent()) || 141;
    const volDb = (menuMusic.getVolumeDb && menuMusic.getVolumeDb()) || 0;
    modal.innerHTML = `
      <div style="background:#16161d;border:1px solid #2b2e46;padding:28px 32px;border-radius:18px;max-width:520px;width:90%;font-family:inherit;color:#e7e7ee;position:relative;box-shadow:0 20px 50px rgba(0,0,0,0.5);">
        <h2 style="margin:0 0 4px 0;font-size:22px;font-weight:800;color:var(--accent);display:flex;align-items:center;gap:8px;">⚙️ Settings</h2>
        <p style="margin:0 0 20px 0;font-size:13px;color:var(--muted);">Adjust visual & audio-reactive presentation.</p>
        <div style="display:flex;flex-direction:column;gap:18px;">
          <div>
            <label style="display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:600;margin-bottom:6px;">
              <span>Bass Glow Intensity</span>
              <span id="glowScaleValue" style="color:var(--accent);font-variant-numeric:tabular-nums;">${storedScale.toFixed(2)}</span>
            </label>
            <input id="glowScaleSlider" type="range" min="0" max="1" step="0.01" value="${storedScale}" style="width:100%;">
            <div style="font-size:11px;color:var(--muted);margin-top:4px;">0 = almost static, 1 = current subtle motion scaling. Future versions may add a more dynamic mode.</div>
          </div>
          <div>
            <label style="display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:600;margin:14px 0 6px;">
              <span>Menu Music Volume</span>
              <span id="musicVolLabel" style="color:var(--accent);font-variant-numeric:tabular-nums;">${volPct}% (${volDb === -Infinity ? '-∞' : volDb.toFixed(1)} dB)</span>
            </label>
            <input id="musicVolSlider" type="range" min="0" max="150" step="1" value="${volPct}" style="width:100%;">
            <div style="font-size:11px;color:var(--muted);margin-top:4px;">100% = baseline (0 dB). 141% ≈ +3 dB. Max 150% (~+3.5 dB). Stored locally.</div>
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:26px;">
          <button id="closeSettings" class="menu-btn secondary" style="min-width:110px;">Close</button>
          <button id="resetSettings" class="menu-btn" style="background:#272d3a;">Reset</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    const slider = modal.querySelector('#glowScaleSlider') as HTMLInputElement;
    const valueEl = modal.querySelector('#glowScaleValue') as HTMLElement;
    slider.addEventListener('input', ()=>{
      const v = parseFloat(slider.value);
      document.documentElement.style.setProperty('--title-glow-scale', v.toString());
      valueEl.textContent = v.toFixed(2);
      localStorage.setItem('tvsl_glowScale', v.toString());
    });
    const musicSlider = modal.querySelector('#musicVolSlider') as HTMLInputElement;
    const musicLabel = modal.querySelector('#musicVolLabel') as HTMLElement;
    if (musicSlider && musicLabel) {
      musicSlider.addEventListener('input', ()=>{
        const pct = parseFloat(musicSlider.value);
        if (menuMusic.setVolumePercent) menuMusic.setVolumePercent(pct);
        const db = menuMusic.getVolumeDb ? menuMusic.getVolumeDb() : 0;
        musicLabel.textContent = `${pct}% (${db === -Infinity ? '-∞' : db.toFixed(1)} dB)`;
      });
    }
    modal.querySelector('#closeSettings').addEventListener('click', ()=>modal.remove());
    modal.querySelector('#resetSettings').addEventListener('click', ()=>{
      slider.value = '1';
      document.documentElement.style.setProperty('--title-glow-scale', '1');
      valueEl.textContent = '1.00';
      localStorage.setItem('tvsl_glowScale', '1');
      if (musicSlider) {
        musicSlider.value = '141';
        if (menuMusic.setVolumePercent) menuMusic.setVolumePercent(141);
        const db = menuMusic.getVolumeDb ? menuMusic.getVolumeDb() : 0;
        musicLabel.textContent = `141% (${db.toFixed(1)} dB)`;
      }
    });
    modal.addEventListener('click', e=>{ if(e.target===modal) modal.remove(); });
  }

  private getDifficultyIcon(difficultyId: string): string {
    const icons = {
      'easy': '🥖',
      'medium': '🍞', 
      'hard': '🥯',
      'nightmare': '🔥'
    };
    return icons[difficultyId] || '⚡';
  }

  private getMapData(): MapData[] {
    return [
      {
        id: 'training_kitchen',
        name: 'Training Kitchen',
        description: 'A simple kitchen layout perfect for learning the basics',
        theme: '🏠',
        layout: 'Simple straight path with basic counter space',
        unlocked: true,
        specialFeatures: ['Tutorial hints', 'Generous placement space'],
        bestWave: {}
      },
      {
        id: 'breakfast_diner',
        name: 'Breakfast Diner',
        description: 'Busy diner with multiple service paths and tight spaces',
        theme: '🍳',
        layout: 'Multiple winding paths with limited counter space',
        unlocked: true,
        specialFeatures: ['Multiple paths', 'Strategic chokepoints'],
        bestWave: {}
      },
      {
        id: 'dual_lanes',
        name: 'Dual Lanes Kitchen',
        description: 'Two simultaneous lanes requiring split defenses',
        theme: '🛣️',
        layout: 'Parallel lanes that converge near the exit',
        unlocked: true,
        specialFeatures: ['Multi-path', 'Weighted spawns', 'Converging end'],
        bestWave: {}
      },
      {
        id: 'tri_split_test',
        name: 'Tri-Split Test',
        description: 'Three-way divergence to stress-test path logic',
        theme: '🔱',
        layout: 'Three lanes with varied curvature converging late',
        unlocked: true,
        specialFeatures: ['Triple path', 'Weighted center bias', 'Distribution test'],
        bestWave: {}
      },
      {
        id: 'industrial_bakery',
        name: 'Industrial Bakery',
        description: 'Large factory setting with conveyor belt systems',
        theme: '🏭',
        layout: 'Long straight conveyors with side production lines',
        unlocked: false,
        specialFeatures: ['High throughput', 'Long-range optimization'],
        bestWave: {}
      },
      {
        id: 'artisan_workshop',
        name: 'Artisan Workshop',
        description: 'Cozy workshop with irregular, organic pathways',
        theme: '🎨',
        layout: 'Curved paths with varied elevation and obstacles',
        unlocked: false,
        specialFeatures: ['Curved paths', 'Elevation changes', 'Natural chokepoints'],
        bestWave: {}
      },
      {
        id: 'molecular_lab',
        name: 'Molecular Gastronomy Lab',
        description: 'High-tech laboratory with complex path networks',
        theme: '🧪',
        layout: 'Multi-level maze with teleportation pads',
        unlocked: false,
        specialFeatures: ['Multi-level paths', 'Teleporter mechanics', 'Complex routing'],
        bestWave: {}
      },
      {
        id: 'bread_dimension',
        name: 'The Bread Dimension',
        description: 'Surreal interdimensional space where normal rules don\'t apply',
        theme: '🌌',
        layout: 'Shifting paths with reality-bending mechanics',
        unlocked: false,
        specialFeatures: ['Dynamic paths', 'Reality shifts', 'Extreme challenge'],
        bestWave: {}
      }
    ];
  }

  private getDifficultySettings(): DifficultySettings[] {
    return [
      {
        id: 'easy',
        name: 'Warm-Up',
        description: 'Perfect for learning the ropes. Enemies are slower and weaker.',
        color: '#7bd88f',
        startingCoins: 400,
        startingLives: 150,
        enemyHealthMultiplier: 0.8,
        enemySpeedMultiplier: 0.8,
        rewardMultiplier: 0.8,
        waveIntensityMultiplier: 0.7
      },
      {
        id: 'medium',
        name: 'Well-Done', 
        description: 'Balanced challenge for experienced toaster operators.',
        color: '#ffb347',
        startingCoins: 300,
        startingLives: 100,
        enemyHealthMultiplier: 1.0,
        enemySpeedMultiplier: 1.0,
        rewardMultiplier: 1.0,
        waveIntensityMultiplier: 1.0
      },
      {
        id: 'hard',
        name: 'Burnt Toast',
        description: 'High stakes! Enemies are tougher and more numerous.',
        color: '#ff6b6b',
        startingCoins: 200,
        startingLives: 75,
        enemyHealthMultiplier: 1.3,
        enemySpeedMultiplier: 1.2,
        rewardMultiplier: 1.6,
        waveIntensityMultiplier: 1.4
      },
      {
        id: 'nightmare',
        name: 'Kitchen Nightmare',
        description: 'For true masters only. Overwhelming odds, maximum rewards.',
        color: '#a855f7',
        startingCoins: 150,
        startingLives: 50,
        enemyHealthMultiplier: 1.8,
        enemySpeedMultiplier: 1.5,
        rewardMultiplier: 2.2,
        waveIntensityMultiplier: 2.0
      }
    ];
  }
}