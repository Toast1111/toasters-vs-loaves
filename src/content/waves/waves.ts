// @ts-nocheck
export function buildWave(n, level){
  const wave=[]; 
  
  // Boss waves every 10 levels
  if (n % 10 === 0) {
    return buildBossWave(n, level);
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
  
  // Add bag of loaves - late game splitter enemy (appears every 8 waves starting from wave 10)
  if (n >= 10 && n % 8 === 0) {
    const bagCount = 1 + Math.floor(n/16); // More frequent than before
    for(let i=0; i<bagCount; i++) {
      wave.push({
        type:'bag_of_loaf', 
        hp:300+25*n, // Reduced from 500+40*n
        speed:45+0.8*n, // Slightly faster
        bounty:80 // Reduced from 150
      });
    }
  }
  
  // Add charred bread - fire resistant but vulnerable to frost
  if (n >= 4 && n % 6 === 0) {
    const charredCount = 2 + Math.floor(n/5);
    for(let i=0; i<charredCount; i++) {
      wave.push({
        type:'charred_bread', 
        hp:150+15*n, 
        speed:55+1.2*n, 
        bounty:25,
        resistances: {fire: 0.8, frost: -0.5} // 80% fire resistance, 50% extra frost damage
      });
    }
  }
  
  // Add stale bread - vulnerable to explosion but resistant to piercing
  if (n >= 3 && n % 4 === 0) {
    const staleCount = 3 + Math.floor(n/4);
    for(let i=0; i<staleCount; i++) {
      wave.push({
        type:'stale_bread', 
        hp:90+8*n, 
        speed:65+1.3*n, 
        bounty:18,
        resistances: {explosion: -0.6, piercing: 0.4} // 60% extra explosion damage, 40% piercing resistance
      });
    }
  }
  
  // Add moldy bread - resists most damage types but spreads poison on death
  if (n >= 6 && n % 8 === 0) {
    const moldyCount = 1 + Math.floor(n/10);
    for(let i=0; i<moldyCount; i++) {
      wave.push({
        type:'moldy_bread', 
        hp:200+20*n, 
        speed:40+0.8*n, 
        bounty:40,
        resistances: {physical: 0.5, fire: 0.3, frost: 0.3, piercing: 0.6} // Resistant to most damage
      });
    }
  }
  
  // Add frozen bread - immune to slow effects, frost resistant but fire vulnerable
  if (n >= 5 && n % 7 === 0) {
    const frozenCount = 2 + Math.floor(n/6);
    for(let i=0; i<frozenCount; i++) {
      wave.push({
        type:'frozen_bread', 
        hp:180+18*n, 
        speed:50+1*n, 
        bounty:35,
        special:'freeze_immune',
        resistances: {frost: 0.9, fire: -0.7} // 90% frost resistance, 70% extra fire damage
      });
    }
  }
  
  // Add volatile bread - explodes on death dealing area damage
  if (n >= 7 && n % 9 === 0) {
    const volatileCount = 1 + Math.floor(n/8);
    for(let i=0; i<volatileCount; i++) {
      wave.push({
        type:'volatile_bread', 
        hp:120+12*n, 
        speed:60+1.5*n, 
        bounty:30,
        resistances: {explosion: 0.5} // Some explosion resistance (but still explodes on death to buff others)
      });
    }
  }
  
  for(let i=wave.length-1;i>0;i--){ const j=(Math.random()* (i+1))|0; [wave[i],wave[j]]=[wave[j],wave[i]]; }
  // If level has multiple paths, assign pathId in a round-robin fashion
  if (level && level.paths && level.paths.length > 1) {
    const totalWeight = level.paths.reduce((s,p)=>s+(p.weight||1),0);
    const pickPath = () => {
      let r = Math.random() * totalWeight;
      for (const p of level.paths){ r -= (p.weight||1); if (r <= 0) return p.id; }
      return level.paths[0].id;
    };
    for (const enemy of wave) enemy.pathId = pickPath();
  }
  return wave;
}

export function buildBossWave(n, level) {
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
  
  if (level && level.paths && level.paths.length > 1) {
    const totalWeight = level.paths.reduce((s,p)=>s+(p.weight||1),0);
    const pickPath = () => {
      let r = Math.random() * totalWeight;
      for (const p of level.paths){ r -= (p.weight||1); if (r <= 0) return p.id; }
      return level.paths[0].id;
    };
    // Boss stays on heaviest path for clarity; escorts weighted
    const sorted = [...level.paths].sort((a,b)=>(b.weight||1)-(a.weight||1));
    const boss = wave[wave.length-1];
    if (boss) boss.pathId = sorted[0].id;
    for (let i=0;i<wave.length-1;i++) wave[i].pathId = pickPath();
  }
  return wave;
}
