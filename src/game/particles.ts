// @ts-nocheck
export const particles=[];
export function spawnCrumbs(x,y,n){ for(let i=0;i<n;i++) particles.push({x,y, vx:(Math.random()*120-60), vy:(Math.random()*40-40), g:180, life:(Math.random()*0.4+0.3)}); }
export function stepParticles(dt){ for(const pr of particles){ pr.vy+=pr.g*dt; pr.x+=pr.vx*dt; pr.y+=pr.vy*dt; pr.life-=dt; if(pr.life<=0) pr.dead=true; } for(let i=particles.length-1;i>=0;i--) if(particles[i].dead) particles.splice(i,1); }
