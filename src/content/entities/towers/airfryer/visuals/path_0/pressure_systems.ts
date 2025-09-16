// @ts-nocheck
import { roundedRect } from '../../../../../../rendering/drawUtils';

// Path 0: Pressure Systems - Tiers 3-5
// Advanced pressure, plasma, and heat-based visual effects
export const PressureSystemsVisuals = {
  
  // Tier 3: Superheated Air
  tier3(ctx, t, state) {
    const theme = {
      shell: '#4a2020', 
      panel: '#ff8a9a', 
      glass: '#3d1a0a', 
      rim: '#663030',
      accent: '#ff3366', 
      detail: '#220505', 
      handle: '#ffb3c7', 
      mute: '#3a0a0a',
      steam: 'rgba(255, 100, 100, 1.0)'
    };
    
    this.drawPressureBase(ctx, t, theme);
    this.drawSuperheatedEffects(ctx, t);
  },

  // Tier 4: Plasma Vortex
  tier4(ctx, t, state) {
    const theme = {
      shell: '#5a1515', 
      panel: '#ff6a7a', 
      glass: '#4d0a0a', 
      rim: '#762020',
      accent: '#ff1144', 
      detail: '#330000', 
      handle: '#ff99b7', 
      mute: '#4a0000',
      steam: 'rgba(255, 50, 50, 1.2)'
    };
    
    this.drawPressureBase(ctx, t, theme);
    this.drawPlasmaVortex(ctx, t);
  },

  // Tier 5: Miniature Sun
  tier5(ctx, t, state) {
    const theme = {
      shell: '#6a0a0a', 
      panel: '#ff4a5a', 
      glass: '#5d0000', 
      rim: '#861010',
      accent: '#ff0022', 
      detail: '#440000', 
      handle: '#ff7799', 
      mute: '#5a0000',
      steam: 'rgba(255, 200, 100, 1.5)'
    };
    
    this.drawPressureBase(ctx, t, theme);
    this.drawMiniatureSun(ctx, t);
  },

  drawPressureBase(ctx, t, theme) {
    // Enhanced version of base airfryer with pressure modifications
    
    // Animation state - more intense for pressure systems
    const chargeProg = Math.min(1, ((t._charge||0) / (t.chargeTime||2)) || 0);
    const isBarraging = (t._gatlingTime||0) > 0;
    
    let spinDelta;
    if (t.chargeShot) {
      if (isBarraging) {
        spinDelta = 1.2; // Even faster for high-tier pressure
      } else {
        spinDelta = 0.03 + chargeProg * 0.6;
      }
    } else {
      spinDelta = 0.25; // Faster base speed
    }
    
    t._ring = (t._ring || 0) + spinDelta;
    t._steam = (t._steam || 0) + 0.04; // Faster steam
    
    // More aggressive hinge movement
    const baseHinge = 0.08;
    const tempo = Math.min(4, Math.max(1, t.fireRate / 1.5));
    const hinge = baseHinge + Math.sin(t._ring * tempo) * 0.1;

    // BODY - More angular and aggressive for pressure systems
    ctx.fillStyle = theme.shell;
    roundedRect(ctx, -20, -26, 40, 52, 8); // Slightly larger
    ctx.strokeStyle = '#111'; 
    ctx.lineWidth = 2; 
    ctx.strokeRect(-20, -26, 40, 52);

    // Pressure relief vents on sides
    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 4; i++) {
      roundedRect(ctx, -22, -20 + i * 10, 3, 6, 1.5);
      roundedRect(ctx, 19, -20 + i * 10, 3, 6, 1.5);
    }
    ctx.globalAlpha = 1;

    // Enhanced control panel with pressure gauges
    ctx.fillStyle = theme.panel;
    roundedRect(ctx, -18, -10, 36, 12, 4);
    
    // Pressure gauges (circular)
    ctx.fillStyle = theme.detail;
    ctx.beginPath();
    ctx.arc(-8, -4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(8, -4, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Gauge needles
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 1.5;
    const gaugeAngle = t._ring * 2; // Spinning pressure readings
    ctx.save();
    ctx.translate(-8, -4);
    ctx.rotate(gaugeAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(3, 0);
    ctx.stroke();
    ctx.restore();
    
    ctx.save();
    ctx.translate(8, -4);
    ctx.rotate(-gaugeAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(3, 0);
    ctx.stroke();
    ctx.restore();

    // Enhanced window and basket
    ctx.fillStyle = theme.rim;
    roundedRect(ctx, -18, 2, 36, 18, 6);
    
    ctx.save();
    ctx.translate(0, 10);
    ctx.rotate(hinge);
    ctx.fillStyle = theme.glass;
    roundedRect(ctx, -16, -8, 32, 16, 4);
    
    // Pressure chamber ring
    this.drawPressureChamber(ctx, t, theme);
    
    ctx.fillStyle = theme.handle;
    roundedRect(ctx, -12, 9, 24, 8, 4);
    ctx.restore();

    // Enhanced feet with pressure supports
    ctx.fillStyle = '#000';
    roundedRect(ctx, -14, 22, 12, 4, 2);
    roundedRect(ctx, 2, 22, 12, 4, 2);
    
    // Pressure relief steam
    this.drawPressureSteam(ctx, t, theme.steam);
  },

  drawPressureChamber(ctx, t, theme) {
    ctx.save();
    ctx.translate(0, 2);
    ctx.rotate(t._ring);
    
    // High-pressure chamber ring with intense spikes
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.stroke();
    
    // Pressure spikes
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 10, Math.sin(angle) * 10);
      ctx.lineTo(Math.cos(angle) * 15, Math.sin(angle) * 15);
      ctx.stroke();
    }
    ctx.restore();
  },

  drawSuperheatedEffects(ctx, t) {
    // Heat distortion waves
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = '#ff6600';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      const radius = 25 + i * 5 + Math.sin(t._ring * 3 + i) * 3;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },

  drawPlasmaVortex(ctx, t) {
    this.drawSuperheatedEffects(ctx, t);
    
    // Plasma arcs
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = '#ff0044';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 4; i++) {
      const angle = (t._ring * 2 + i * Math.PI / 2) % (Math.PI * 2);
      const startRadius = 15;
      const endRadius = 30;
      const startX = Math.cos(angle) * startRadius;
      const startY = Math.sin(angle) * startRadius;
      const endX = Math.cos(angle) * endRadius;
      const endY = Math.sin(angle) * endRadius;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(startX * 1.5, startY * 1.5, endX, endY);
      ctx.stroke();
    }
    ctx.restore();
  },

  drawMiniatureSun(ctx, t) {
    this.drawPlasmaVortex(ctx, t);
    
    // Solar corona effect
    ctx.save();
    ctx.globalAlpha = 0.3 + Math.sin(t._ring * 4) * 0.2;
    
    // Gradient-like effect with multiple circles
    const colors = ['#ffff00', '#ff8800', '#ff4400', '#ff0000'];
    for (let i = 0; i < colors.length; i++) {
      ctx.strokeStyle = colors[i];
      ctx.lineWidth = 3 - i * 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, 35 + i * 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Solar flares
    ctx.strokeStyle = '#ffff88';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + t._ring;
      const flareLength = 20 + Math.sin(t._ring * 3 + i) * 10;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 35, Math.sin(angle) * 35);
      ctx.lineTo(Math.cos(angle) * (35 + flareLength), Math.sin(angle) * (35 + flareLength));
      ctx.stroke();
    }
    ctx.restore();
  },

  drawPressureSteam(ctx, t, steamColor) {
    // More intense steam for pressure systems
    const rise = (offset, phaseScale, x0, intensity) => {
      ctx.save();
      ctx.translate(0, -24);
      ctx.globalAlpha = 0.8 + intensity * 0.2;
      ctx.strokeStyle = steamColor;
      ctx.lineWidth = 1.5 + intensity * 0.5;
      const tphase = t._steam * phaseScale + offset;
      const yoff = -15 - (Math.sin(tphase) + 1) * 5;
      ctx.beginPath();
      ctx.moveTo(x0, 0);
      ctx.quadraticCurveTo(x0 + 4, -8, x0, -16 + yoff);
      ctx.quadraticCurveTo(x0 - 6, -28 + yoff, x0, -40 + yoff * 1.5);
      ctx.stroke();
      ctx.restore();
    };
    
    // More steam jets for pressure systems
    rise(-0.3, 1.2, -12, 1.0);
    rise(-0.1, 1.0, -4, 0.8);
    rise(0.1, 1.1, 4, 0.8);
    rise(0.3, 1.3, 12, 1.0);
  }
};