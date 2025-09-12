// @ts-nocheck
import { roundedRect } from '../../../drawUtils';

// General visual system for airfryer tiers 1-2 (all paths)
// This handles the base airfryer and early upgrades before paths diverge significantly
export const GeneralAirfryerVisuals = {
  
  // Base visual (no upgrades)
  base(ctx, t, state) {
    // Default theme - neutral grays and purples
    const theme = {
      shell: '#2b2f3c', 
      panel: '#b9acd2', 
      glass: '#141a2b', 
      rim: '#3a3550',
      accent: '#6a5aed', 
      detail: '#0b0f18', 
      handle: '#cfc7e6', 
      mute: '#12162a',
      steam: 'rgba(191, 198, 255, 0.7)'
    };
    
    this.drawAirfryerBase(ctx, t, theme);
    this.drawBasicRing(ctx, t, theme.accent);
  },

  // Path 0 Tier 1-2: Early pressure upgrades
  path0_tier12(ctx, t, state) {
    // Slightly warmer theme for pressure path
    const theme = {
      shell: '#3c2b2b', 
      panel: '#d2acb9', 
      glass: '#2b1a14', 
      rim: '#553a3a',
      accent: '#ed5a6a', 
      detail: '#180b0b', 
      handle: '#e6c7cf', 
      mute: '#2a1612',
      steam: 'rgba(255, 150, 150, 0.8)'
    };
    
    this.drawAirfryerBase(ctx, t, theme);
    this.drawPressureRing(ctx, t, theme.accent);
  },

  // Path 1 Tier 1-2: Early range upgrades  
  path1_tier12(ctx, t, state) {
    // Cooler theme for range path
    const theme = {
      shell: '#2b3c3c', 
      panel: '#acd2d2', 
      glass: '#141a2b', 
      rim: '#3a5055',
      accent: '#5aaced', 
      detail: '#0b1118', 
      handle: '#c7e6e6', 
      mute: '#122a2a',
      steam: 'rgba(150, 200, 255, 0.8)'
    };
    
    this.drawAirfryerBase(ctx, t, theme);
    this.drawRangeRing(ctx, t, theme.accent);
  },

  // Path 2 Tier 1-2: Early cyclone upgrades
  path2_tier12(ctx, t, state) {
    // Electric theme for cyclone path
    const theme = {
      shell: '#2b2f3c', 
      panel: '#b9acd2', 
      glass: '#1a2b14', 
      rim: '#3a5035',
      accent: '#6aed5a', 
      detail: '#0b180b', 
      handle: '#cfe6c7', 
      mute: '#162a12',
      steam: 'rgba(150, 255, 150, 0.8)'
    };
    
    this.drawAirfryerBase(ctx, t, theme);
    this.drawCycloneRing(ctx, t, theme.accent);
  },

  // Base airfryer structure - shared by all early upgrades
  drawAirfryerBase(ctx, t, theme) {
    // Animation state
    const chargeProg = Math.min(1, ((t._charge||0) / (t.chargeTime||2)) || 0);
    const isBarraging = (t._gatlingTime||0) > 0;
    
    // Spinning speed based on charge state
    let spinDelta;
    if (t.chargeShot) {
      if (isBarraging) {
        spinDelta = 0.8; // Super fast during barrage
      } else {
        spinDelta = 0.02 + chargeProg * 0.4; // Slow to fast based on charge
      }
    } else {
      spinDelta = 0.15; // Normal mode
    }
    
    t._ring = (t._ring || 0) + spinDelta;
    t._steam = (t._steam || 0) + 0.03;
    
    // Breathing hinge based on firing tempo
    const baseHinge = 0.05;
    const tempo = Math.min(3, Math.max(1, t.fireRate / 2));
    const hinge = baseHinge + Math.sin(t._ring * tempo) * 0.06;

    // BODY (rounded shell)
    ctx.fillStyle = theme.shell; 
    roundedRect(ctx, -18, -24, 36, 48, 9);
    ctx.strokeStyle = '#1e2335'; 
    ctx.lineWidth = 1.5; 
    ctx.strokeRect(-18, -24, 36, 48);

    // Side highlights
    ctx.globalAlpha = 0.18; 
    ctx.fillStyle = '#ffffff';
    roundedRect(ctx, -17, -20, 4, 40, 6);
    roundedRect(ctx, 13, -20, 4, 40, 6);
    ctx.globalAlpha = 1;

    // TOP PLATE
    ctx.fillStyle = '#343a4e'; 
    roundedRect(ctx, -16, -22, 32, 10, 4);
    // Vents
    ctx.fillStyle = theme.mute; 
    const vx0 = -16, vy = -18, vw = 4.2, vh = 2.4, gap = 2.2;
    for (let i = 0; i < 8; i++) { 
      roundedRect(ctx, vx0 + i * (vw + gap), vy, vw, vh, 1.2); 
    }

    // CONTROL PANEL band
    ctx.fillStyle = theme.panel; 
    roundedRect(ctx, -16, -8, 32, 8, 4);
    // Small display + knobs
    ctx.fillStyle = theme.detail; 
    roundedRect(ctx, -6, -7, 12, 6, 3);
    ctx.fillStyle = '#ececf5';
    roundedRect(ctx, -14, -7, 5, 5, 2.5); 
    roundedRect(ctx, 9, -7, 5, 5, 2.5);
    ctx.fillStyle = '#8d93a6';
    roundedRect(ctx, -12.5, -6, 2, 3.6, 1.8); 
    roundedRect(ctx, 10.5, -6, 2, 3.6, 1.8);

    // WINDOW RIM
    ctx.fillStyle = theme.rim; 
    roundedRect(ctx, -16, 0, 32, 16, 5);

    // BASKET (hinged from bottom of window)
    ctx.save();
    ctx.translate(0, 8);
    ctx.rotate(hinge);
    // Basket glass
    ctx.fillStyle = theme.glass; 
    roundedRect(ctx, -14, -6, 28, 12, 3.5);
    
    // Charge progress arc
    if ((t.chargeShot || 0) && (t._gatlingTime||0) <= 0) {
      const prog = Math.min(1, ((t._charge||0) / (t.chargeTime||2)) || 0);
      if (prog > 0) {
        let progressColor;
        if (prog < 0.5) {
          progressColor = `rgb(${Math.floor(154 + prog * 200)}, ${Math.floor(168 + prog * 174)}, 255)`;
        } else {
          const redProg = (prog - 0.5) * 2;
          progressColor = `rgb(255, ${Math.floor(255 - redProg * 100)}, ${Math.floor(255 - redProg * 255)})`;
        }
        ctx.strokeStyle = progressColor; 
        ctx.lineWidth = 3.0;
        ctx.beginPath(); 
        ctx.arc(0, 3, 11.5, -Math.PI/2, -Math.PI/2 + prog * Math.PI * 2);
        ctx.stroke();
      }
    }
    
    // During barrage indicator
    if ((t._gatlingTime||0) > 0) {
      ctx.strokeStyle = '#ff6666'; 
      ctx.lineWidth = 2.5;
      ctx.beginPath(); 
      ctx.arc(0, 3, 13, 0, Math.PI * 2); 
      ctx.stroke();
    }
    
    // Handle
    ctx.fillStyle = theme.handle; 
    roundedRect(ctx, -10, 7, 20, 6, 3);
    ctx.restore();

    // FEET
    ctx.fillStyle = '#0c101c'; 
    roundedRect(ctx, -12, 20, 10, 3, 1.5); 
    roundedRect(ctx, 2, 20, 10, 3, 1.5);

    // STEAM wisps
    this.drawSteam(ctx, t, theme.steam);
  },

  // Different ring patterns for early tiers
  drawBasicRing(ctx, t, accent) {
    ctx.save();
    ctx.translate(0, 11);
    ctx.rotate(t._ring);
    
    // Basic dashed ring
    ctx.strokeStyle = accent; 
    ctx.lineWidth = 1.8;
    ctx.setLineDash([7, 6]);
    ctx.beginPath(); 
    ctx.arc(0, 0, 9.5, 0, Math.PI * 2); 
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  },

  drawPressureRing(ctx, t, accent) {
    ctx.save();
    ctx.translate(0, 11);
    ctx.rotate(t._ring);
    
    // Solid ring with small pressure indicators
    ctx.strokeStyle = accent; 
    ctx.lineWidth = 2.0;
    ctx.beginPath(); 
    ctx.arc(0, 0, 9.5, 0, Math.PI * 2); 
    ctx.stroke();
    
    // Small pressure spikes (fewer than high-tier)
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 8.5, Math.sin(angle) * 8.5);
      ctx.lineTo(Math.cos(angle) * 10.5, Math.sin(angle) * 10.5);
      ctx.stroke();
    }
    ctx.restore();
  },

  drawRangeRing(ctx, t, accent) {
    ctx.save();
    ctx.translate(0, 11);
    ctx.rotate(t._ring);
    
    // Single dotted ring for early range upgrades
    ctx.strokeStyle = accent; 
    ctx.lineWidth = 1.8;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); 
    ctx.arc(0, 0, 9.5, 0, Math.PI * 2); 
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  },

  drawCycloneRing(ctx, t, accent) {
    ctx.save();
    ctx.translate(0, 11);
    ctx.rotate(t._ring);
    
    // Simple spiral pattern (less complex than high-tier)
    ctx.strokeStyle = accent; 
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const radius = 6 + (i / 30) * 4;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  },

  drawSteam(ctx, t, steamColor) {
    const rise = (offset, phaseScale, x0) => {
      ctx.save();
      ctx.translate(0, -22);
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = steamColor; 
      ctx.lineWidth = 1.2;
      const tphase = t._steam * phaseScale + offset;
      const yoff = -10 - (Math.sin(tphase) + 1) * 3;
      ctx.beginPath();
      ctx.moveTo(x0, 0);
      ctx.quadraticCurveTo(x0 + 3, -6, x0, -12 + yoff);
      ctx.quadraticCurveTo(x0 - 4, -20 + yoff, x0, -30 + yoff * 1.3);
      ctx.stroke();
      ctx.restore();
    };
    rise(-0.2, 1.0, -8);
    rise(0.0, 1.1, 0);
    rise(0.3, 1.2, 8);
  }
};