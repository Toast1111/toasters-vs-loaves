// @ts-nocheck
export function createInitialState(w,h){
  return {
    w,h,
    coins:150, lives:100, wave:0, ap:0,
    placing:null, selected:null, showRanges:true, running:false,
    global:{damage:1, fireRate:1, range:1, bounty:1, pierce:0},
    waveQueue:[], spawnTimer:0, betweenWaves:true, waveInProgress:false, idSeq:1,
    toasters:[], texts:[]
  };
}
