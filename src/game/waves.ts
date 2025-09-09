// @ts-nocheck
export function buildWave(n){
  const wave=[]; 
  
  // Boss waves every 10 levels
  if (n % 10 === 0) {
    return buildBossWave(n);
  }
  
  const base=15+Math.floor(n*1.5);
  for(let i=0;i<base;i++) wave.push({type:'slice', hp:20+4*n, speed:70+1.5*n, bounty:4});
  if(n%3===0) for(let i=0;i<6+Math.floor(n/2);i++) wave.push({type:'baguette', hp:80+10*n, speed:60+1.2*n, bounty:9});
  if(n%5===0) for(let i=0;i<3+Math.floor(n/3);i++) wave.push({type:'rye', hp:180+18*n, speed:55+1.1*n, bounty:15});
  
  // Add splittable bread types starting from wave 2
  if(n >= 2 && n % 4 === 0) {
    const halfLoafCount = 2 + Math.floor(n/6);
    for(let i=0; i<halfLoafCount; i++) {
      wave.push({type:'half_loaf', hp:120+12*n, speed:50+1*n, bounty:20});
    }
  }
  
  // Add whole loaves starting from wave 4
  if(n >= 4 && n % 6 === 0) {
    const wholeLoafCount = 1 + Math.floor(n/8);
    for(let i=0; i<wholeLoafCount; i++) {
      wave.push({type:'whole_loaf', hp:250+20*n, speed:45+0.8*n, bounty:35});
    }
  }
  
  // Add artisan loaves starting from wave 7 (premium splitters)
  if(n >= 7 && n % 8 === 0) {
    const artisanCount = 1 + Math.floor(n/12);
    for(let i=0; i<artisanCount; i++) {
      wave.push({type:'artisan_loaf', hp:200+15*n, speed:48+0.9*n, bounty:45});
    }
  }
  
  // Add dinner rolls starting from wave 3 (small but splits into crumbs)
  if(n >= 3 && n % 5 === 0) {
    const rollCount = 4 + Math.floor(n/4);
    for(let i=0; i<rollCount; i++) {
      wave.push({type:'dinner_roll', hp:60+6*n, speed:75+2*n, bounty:12});
    }
  }
  
  // Add mini-bosses in later waves
  if (n >= 5 && n % 7 === 0) {
    wave.push({type:'croissant', hp:300+25*n, speed:50+1*n, bounty:30, special:'regenerate'});
  }
  
  for(let i=wave.length-1;i>0;i--){ const j=(Math.random()* (i+1))|0; [wave[i],wave[j]]=[wave[j],wave[i]]; }
  return wave;
}

export function buildBossWave(n) {
  const wave = [];
  const bossLevel = Math.floor(n / 10);
  
  // Add some regular enemies as escorts
  const escorts = Math.min(8, 3 + bossLevel);
  for(let i = 0; i < escorts; i++) {
    wave.push({type:'baguette', hp:120+15*n, speed:65+2*n, bounty:12});
  }
  
  // Select boss type based on wave
  if (bossLevel === 1 || bossLevel % 3 === 1) {
    // Giant Sourdough - splits into smaller pieces
    wave.push({
      type: 'sourdough_boss',
      hp: 800 + 200 * bossLevel,
      speed: 40 + bossLevel * 2,
      bounty: 150 + 50 * bossLevel,
      special: 'split',
      size: 'large'
    });
  } else if (bossLevel % 3 === 2) {
    // French Bread Boss - speed bursts
    wave.push({
      type: 'french_boss',
      hp: 600 + 150 * bossLevel,
      speed: 35 + bossLevel * 2,
      bounty: 120 + 40 * bossLevel,
      special: 'speed_burst',
      size: 'large'
    });
  } else {
    // Pretzel Tank - high armor, slow
    wave.push({
      type: 'pretzel_boss',
      hp: 1200 + 300 * bossLevel,
      speed: 25 + bossLevel,
      bounty: 200 + 75 * bossLevel,
      special: 'armor',
      armor: 0.5, // 50% damage reduction
      size: 'large'
    });
  }
  
  return wave;
}
