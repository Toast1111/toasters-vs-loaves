// @ts-nocheck
import { isPath, waypoints, grid } from "./map";
import { breads } from "./breads";
import { projectiles } from "./projectiles";
import { particles, damageNumbers } from "./particles";
import { heatZones, screenShake } from "./effects";
import { powerups, activePowerups, POWERUP_TYPES } from "./powerups";
import { getTowerBase } from "./towers";
import { roundedRect } from "./drawUtils";

export function drawScene(ctx, state){
  const W=state.w, H=state.h;
  
  // Apply screen shake
  if (screenShake.duration > 0) {
    const shakeX = (Math.random() - 0.5) * screenShake.intensity * 2;
    const shakeY = (Math.random() - 0.5) * screenShake.intensity * 2;
    ctx.save();
    ctx.translate(shakeX, shakeY);
  }
  
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle="#0d1017"; ctx.fillRect(0,0,W,H);
  for(let y=0;y<H;y+=grid.ch){
    for(let x=0;x<W;x+=grid.cw){
      const cx=x+grid.cw/2, cy=y+grid.ch/2;
      const path=isPath(cx,cy);
      ctx.fillStyle= path? '#1d2331' : '#111827';
      ctx.fillRect(x,y,grid.cw-1,grid.ch-1);
    }
  }
  ctx.strokeStyle="#2a3246"; ctx.lineWidth=8; ctx.beginPath(); ctx.moveTo(waypoints[0].x,waypoints[0].y); for(let i=1;i<waypoints.length;i++){ const p=waypoints[i]; ctx.lineTo(p.x,p.y); } ctx.stroke();
  for(const e of breads){ 
    if(!e.alive) continue; 
    const hp=e.hp/e.maxHp; 
    ctx.save(); ctx.translate(e.x,e.y);
    
    // Different visuals for different bread types
    if (e.type === 'sourdough_boss') {
      // Giant sourdough boss
      ctx.fillStyle="#d4a574"; roundedRect(ctx,-e.r,-e.r*0.8,e.r*2,e.r*1.6,e.r*0.4);
      ctx.fillStyle="#b8956a"; roundedRect(ctx,-e.r*0.8,-e.r*0.6,e.r*1.6,e.r*0.8,e.r*0.3);
      // Cracks indicating damage
      if (hp < 0.7) {
        ctx.strokeStyle="#8b6f47"; ctx.lineWidth=2;
        ctx.beginPath(); 
        ctx.moveTo(-e.r*0.5, -e.r*0.3); ctx.lineTo(-e.r*0.2, e.r*0.2);
        ctx.moveTo(e.r*0.3, -e.r*0.4); ctx.lineTo(e.r*0.6, e.r*0.1);
        ctx.stroke();
      }
    } else if (e.type === 'french_boss') {
      // French bread boss - elongated
      ctx.fillStyle="#e8c5a0"; roundedRect(ctx,-e.r*1.2,-e.r*0.6,e.r*2.4,e.r*1.2,e.r*0.2);
      ctx.fillStyle="#d4b087"; roundedRect(ctx,-e.r,-e.r*0.4,e.r*2,e.r*0.6,e.r*0.15);
      // Speed burst effect
      if (e.lastSpeedBurst < 0) {
        ctx.strokeStyle="#ff6b35"; ctx.lineWidth=3;
        for(let i = 0; i < 5; i++) {
          ctx.beginPath(); ctx.arc(0,0,e.r + i*3,0,Math.PI*2); ctx.stroke();
        }
      }
    } else if (e.type === 'pretzel_boss') {
      // Pretzel tank - twisted shape
      ctx.fillStyle="#8b7355"; 
      ctx.beginPath();
      for(let i = 0; i < 8; i++) {
        const angle = i * Math.PI / 4;
        const r = e.r * (0.8 + 0.4 * Math.sin(angle * 3));
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill();
      // Armor plating
      ctx.fillStyle="#696969"; roundedRect(ctx,-e.r*0.6,-e.r*0.6,e.r*1.2,e.r*1.2,3);
    } else if (e.type === 'whole_loaf') {
      // Whole loaf - large rectangular bread
      ctx.fillStyle="#deb887"; roundedRect(ctx,-e.r*1.1,-e.r*0.7,e.r*2.2,e.r*1.4,e.r*0.3);
      ctx.fillStyle="#cd853f"; roundedRect(ctx,-e.r*1.0,-e.r*0.6,e.r*2.0,e.r*0.8,e.r*0.2);
      // Split indicators (dotted lines showing where it will split)
      ctx.strokeStyle="#8b7355"; ctx.lineWidth=1; ctx.setLineDash([3,3]);
      ctx.beginPath(); 
      ctx.moveTo(-e.r*0.3, -e.r*0.6); ctx.lineTo(-e.r*0.3, e.r*0.6);
      ctx.moveTo(e.r*0.3, -e.r*0.6); ctx.lineTo(e.r*0.3, e.r*0.6);
      ctx.stroke(); ctx.setLineDash([]);
    } else if (e.type === 'half_loaf') {
      // Half loaf - medium rectangular bread
      ctx.fillStyle="#f4a460"; roundedRect(ctx,-e.r*0.9,-e.r*0.6,e.r*1.8,e.r*1.2,e.r*0.3);
      ctx.fillStyle="#d2691e"; roundedRect(ctx,-e.r*0.8,-e.r*0.5,e.r*1.6,e.r*0.7,e.r*0.2);
      // Split indicator
      ctx.strokeStyle="#8b4513"; ctx.lineWidth=1; ctx.setLineDash([2,2]);
      ctx.beginPath(); ctx.moveTo(0, -e.r*0.5); ctx.lineTo(0, e.r*0.5); ctx.stroke(); ctx.setLineDash([]);
    } else if (e.type === 'artisan_loaf') {
      // Artisan loaf - premium bread with decorative scoring
      ctx.fillStyle="#daa520"; roundedRect(ctx,-e.r*1.0,-e.r*0.75,e.r*2.0,e.r*1.5,e.r*0.4);
      ctx.fillStyle="#b8860b"; roundedRect(ctx,-e.r*0.9,-e.r*0.65,e.r*1.8,e.r*0.9,e.r*0.3);
      // Artisan scoring pattern
      ctx.strokeStyle="#8b7d6b"; ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(-e.r*0.6, -e.r*0.3); ctx.lineTo(e.r*0.6, -e.r*0.1);
      ctx.moveTo(-e.r*0.6, e.r*0.1); ctx.lineTo(e.r*0.6, e.r*0.3);
      ctx.stroke();
    } else if (e.type === 'dinner_roll') {
      // Dinner roll - small round bread
      ctx.fillStyle="#f5deb3"; 
      ctx.beginPath(); ctx.arc(0,0,e.r,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#ddd8be"; 
      ctx.beginPath(); ctx.arc(0,0,e.r*0.7,0,Math.PI*2); ctx.fill();
      // Texture lines
      ctx.strokeStyle="#d2b48c"; ctx.lineWidth=1;
      for(let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3);
        ctx.beginPath(); 
        ctx.moveTo(Math.cos(angle) * e.r*0.3, Math.sin(angle) * e.r*0.3);
        ctx.lineTo(Math.cos(angle) * e.r*0.6, Math.sin(angle) * e.r*0.6);
        ctx.stroke();
      }
    } else if (e.type === 'crumb') {
      // Crumb - tiny bread pieces
      ctx.fillStyle="#ddc3a5"; 
      const sides = 5 + Math.floor(Math.random() * 3); // Irregular shape
      ctx.beginPath();
      for(let i = 0; i < sides; i++) {
        const angle = (i * Math.PI * 2 / sides);
        const radius = e.r * (0.7 + Math.random() * 0.3);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill();
    } else if (e.type === 'baguette') {
      // Baguette - elongated French bread
      ctx.fillStyle="#e8c5a0"; roundedRect(ctx,-e.r*1.4,-e.r*0.5,e.r*2.8,e.r*1.0,e.r*0.2);
      ctx.fillStyle="#d4b087"; roundedRect(ctx,-e.r*1.3,-e.r*0.4,e.r*2.6,e.r*0.6,e.r*0.15);
      // Diagonal score marks
      ctx.strokeStyle="#b8956a"; ctx.lineWidth=1;
      for(let i = -1; i <= 1; i++) {
        ctx.beginPath(); 
        ctx.moveTo(i*e.r*0.6, -e.r*0.3); ctx.lineTo(i*e.r*0.6, e.r*0.3);
        ctx.stroke();
      }
    } else if (e.type === 'rye') {
      // Rye bread - darker, denser looking
      ctx.fillStyle="#8b4513"; roundedRect(ctx,-e.r*0.9,-e.r*0.7,e.r*1.8,e.r*1.4,e.r*0.4);
      ctx.fillStyle="#a0522d"; roundedRect(ctx,-e.r*0.8,-e.r*0.6,e.r*1.6,e.r*0.8,e.r*0.3);
      // Seeds texture
      ctx.fillStyle="#654321";
      for(let i = 0; i < 8; i++) {
        const x = (Math.random() - 0.5) * e.r * 1.4;
        const y = (Math.random() - 0.5) * e.r * 1.0;
        ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI*2); ctx.fill();
      }
    } else if (e.type === 'croissant') {
      // Croissant - crescent shaped
      ctx.fillStyle="#f4e4bc"; 
      ctx.beginPath();
      ctx.arc(-e.r*0.3, 0, e.r*0.8, 0, Math.PI*2); 
      ctx.arc(e.r*0.3, 0, e.r*0.6, 0, Math.PI*2); 
      ctx.fill();
      ctx.fillStyle="#e6d3a3";
      ctx.beginPath(); ctx.arc(0, 0, e.r*0.5, 0, Math.PI*2); ctx.fill();
      // Flaky layers
      ctx.strokeStyle="#d4af37"; ctx.lineWidth=1;
      for(let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.arc(0, 0, e.r*0.3 + i*3, 0, Math.PI*2); ctx.stroke();
      }
    } else {
      // Regular slice bread (default)
      ctx.fillStyle="#c58a55"; roundedRect(ctx,-e.r*0.875,-e.r*0.625,e.r*1.75,e.r*1.25,e.r*0.5);
      ctx.fillStyle="#8c5a2f"; roundedRect(ctx,-e.r*0.875,-e.r*0.75,e.r*1.75,e.r*0.5,e.r*0.375);
    }
    
    // Health bar
    const barWidth = e.r * 1.75;
    const barHeight = e.r > 15 ? 5 : 3; // Bigger bars for bosses
    ctx.fillStyle="#000000aa"; ctx.fillRect(-barWidth/2,-e.r-barHeight*2,barWidth,barHeight);
    ctx.fillStyle= hp>0.4? '#7bd88f' : '#ff6b6b'; ctx.fillRect(-barWidth/2,-e.r-barHeight*2,barWidth*hp,barHeight);
    
    // Boss crown indicator
    if (e.r > 15) {
      ctx.fillStyle="#ffd700";
      ctx.beginPath();
      for(let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2 / 5) - Math.PI/2;
        const r1 = e.r + 8, r2 = e.r + 4;
        const x1 = Math.cos(angle) * r1, y1 = Math.sin(angle) * r1;
        const x2 = Math.cos(angle + Math.PI/5) * r2, y2 = Math.sin(angle + Math.PI/5) * r2;
        if (i === 0) ctx.moveTo(x1, y1);
        else ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.closePath(); ctx.fill();
    }
    
    ctx.restore(); 
  }
  for(const t of state.toasters){
    ctx.save(); ctx.translate(t.x,t.y);
    const def = getTowerBase(t.type);
    if (def && typeof def.draw === 'function') {
      def.draw(ctx, t, state);
    } else {
      // Fallback default toaster style
      ctx.fillStyle="#9aa3b2"; roundedRect(ctx,-16,-14,32,28,6);
      ctx.fillStyle="#cfd6e2"; roundedRect(ctx,-14,-12,28,10,4);
      ctx.fillStyle="#2b2f3c"; ctx.fillRect(-10,-6,8,4); ctx.fillRect(2,-6,8,4);
      ctx.fillStyle="#1e2230"; ctx.beginPath(); ctx.arc(12,4,4,0,Math.PI*2); ctx.fill();
    }
    if(state.showRanges && (!state.selected || state.selected===t.id)){ 
      ctx.strokeStyle="#3a445f66"; ctx.beginPath(); ctx.arc(0,0,t.range,0,Math.PI*2); ctx.stroke(); 
    }
    ctx.restore();
  }
  for(const p of projectiles){ 
    ctx.fillStyle="#ffd166"; 
    ctx.beginPath(); ctx.arc(p.x,p.y,3,0,Math.PI*2); ctx.fill(); 
  }
  
  // Draw heat zones
  for(const zone of heatZones) {
    const alpha = zone.duration / zone.maxDuration;
    ctx.fillStyle = `rgba(255, 100, 50, ${alpha * 0.3})`;
    ctx.beginPath(); ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = `rgba(255, 150, 100, ${alpha * 0.6})`;
    ctx.lineWidth = 2; ctx.stroke();
  }
  
  for(const pr of particles){ 
    if (pr.type === 'explosion') {
      ctx.fillStyle = pr.color;
      const size = (pr.life / 0.6) * 4;
      ctx.fillRect(pr.x - size/2, pr.y - size/2, size, size);
    } else if (pr.type === 'muzzle') {
      ctx.fillStyle = pr.color;
      const alpha = pr.life / 0.15;
      ctx.globalAlpha = alpha;
      ctx.fillRect(pr.x - 2, pr.y - 2, 4, 4);
      ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = "#e7c08a88"; 
      ctx.fillRect(pr.x, pr.y, 2, 2); 
    }
  }
  
  // Draw damage numbers
  for(const dmg of damageNumbers) {
    const alpha = dmg.life / 1.5;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = dmg.isCrit ? '#ff6b35' : '#ffd166';
    ctx.font = `${12 * dmg.scale}px ui-monospace,Consolas`;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeText(dmg.damage.toString(), dmg.x, dmg.y);
    ctx.fillText(dmg.damage.toString(), dmg.x, dmg.y);
    ctx.globalAlpha = 1;
  }
  
  // Draw powerups
  for(const powerup of powerups) {
    const bobOffset = Math.sin(powerup.bobTime) * 3;
    const sparkle = Math.sin(powerup.sparkleTime) * 0.3 + 0.7;
    const fadeAlpha = Math.min(1, powerup.life / 3); // Fade out in last 3 seconds
    
    ctx.save();
    ctx.translate(powerup.x, powerup.y + bobOffset);
    ctx.globalAlpha = fadeAlpha;
    
    // Glow effect
    const powerupData = POWERUP_TYPES[powerup.type];
    ctx.fillStyle = powerupData.color + '44';
    ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI*2); ctx.fill();
    
    // Main powerup orb
    ctx.fillStyle = powerupData.color;
    ctx.globalAlpha = fadeAlpha * sparkle;
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.fill();
    
    // Sparkle effect
    for(let i = 0; i < 6; i++) {
      const angle = (powerup.sparkleTime + i * Math.PI / 3) % (Math.PI * 2);
      const sparkleRadius = 12 + Math.sin(powerup.sparkleTime * 2 + i) * 2;
      const sx = Math.cos(angle) * sparkleRadius;
      const sy = Math.sin(angle) * sparkleRadius;
      ctx.fillStyle = '#ffffff' + Math.floor(sparkle * 255).toString(16).padStart(2, '0');
      ctx.fillRect(sx-1, sy-1, 2, 2);
    }
    
    ctx.restore();
  }
  
  for(const f of state.texts){ const a=1-Math.min(1,f.t/1.2); ctx.globalAlpha=a; ctx.fillStyle=f.isBad?'#ff6b6b':'#ffd166'; ctx.font='12px ui-monospace,Consolas'; ctx.fillText(f.str,f.x,f.y-10-20*f.t); ctx.globalAlpha=1; f.t+=1/60; }
  
  // Restore screen shake transformation
  if (screenShake.duration > 0) {
    ctx.restore();
  }
}
// moved to drawUtils.ts
