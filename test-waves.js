// Test script to verify wave generation continues after wave 10
const { buildWave, buildBossWave } = require('./src/content/waves/waves.ts');

console.log('Testing wave progression after wave 10...\n');

for (let wave = 9; wave <= 15; wave++) {
  let waveData;
  let waveType;
  
  if (wave % 10 === 0) {
    waveData = buildBossWave(wave, null);
    waveType = 'BOSS';
  } else {
    waveData = buildWave(wave, null);
    waveType = 'REGULAR';
  }
  
  console.log(`Wave ${wave} (${waveType}): ${waveData.length} enemies`);
  if (waveData.length === 0) {
    console.error(`❌ ERROR: Wave ${wave} has NO enemies!`);
  } else {
    console.log(`✅ Wave ${wave} OK: ${waveData.map(e => e.type).slice(0, 5).join(', ')}${waveData.length > 5 ? '...' : ''}`);
  }
}

console.log('\nWave generation test complete.');