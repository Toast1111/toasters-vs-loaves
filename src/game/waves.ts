// @ts-nocheck
export function buildWave(n){
  const wave=[]; const base=15+Math.floor(n*1.5);
  for(let i=0;i<base;i++) wave.push({type:'slice', hp:20+4*n, speed:70+1.5*n, bounty:4});
  if(n%3===0) for(let i=0;i<6+Math.floor(n/2);i++) wave.push({type:'baguette', hp:80+10*n, speed:60+1.2*n, bounty:9});
  if(n%5===0) for(let i=0;i<3+Math.floor(n/3);i++) wave.push({type:'rye', hp:180+18*n, speed:55+1.1*n, bounty:15});
  for(let i=wave.length-1;i>0;i--){ const j=(Math.random()* (i+1))|0; [wave[i],wave[j]]=[wave[j],wave[i]]; }
  return wave;
}
