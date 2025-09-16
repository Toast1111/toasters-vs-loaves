// @ts-nocheck
export function createInitialState(w,h){
  return {
    w,h,
    coins:1000, lives:100, wave:0, ap:0, // Enough coins for testing upgrades
    placing:null, selected:null, showRanges:true, running:false,
    global:{damage:1, fireRate:1, range:1, bounty:1, pierce:0},
    waveQueue:[], spawnTimer:0, betweenWaves:true, waveInProgress:false, idSeq:1,
    // Auto-wave system
    autoWave: true, autoWaveDelay: 3.0, autoWaveTimer: 0, paused: false,
    toasters:[], texts:[]
  };
}
