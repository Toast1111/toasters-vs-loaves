// @ts-nocheck
export function createInitialState(w,h){
  return {
    w,h,
    coins:500, lives:100, wave:0, ap:0, // Balanced starting coins
    placing:null, selected:null, showRanges:true, running:false,
    global:{damage:1, fireRate:1, range:1, bounty:1, pierce:0},
    waveQueue:[], spawnTimer:0, betweenWaves:true, waveInProgress:false, idSeq:1,
    // Simple auto-wave timer
    autoWaveTimer: 3,
    toasters:[], texts:[],
    currentLevel: null
  };
}
