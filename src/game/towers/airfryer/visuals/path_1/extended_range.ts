// @ts-nocheck
import { roundedRect } from '../../../../drawUtils';

// Path 1: Extended Range - Tiers 3-5  
// Advanced detection, atmospheric control, and weather manipulation visuals
export const ExtendedRangeVisuals = {
  
  // Tier 3: Atmospheric Control
  tier3(ctx, t, state) {
    const theme = {
      shell: '#203040', 
      panel: '#8accff', 
      glass: '#0a1a3d', 
      rim: '#305066',
      accent: '#33aaff', 
      detail: '#051122', 
      handle: '#b3e6ff', 
      mute: '#0a223a',
      steam: 'rgba(100, 180, 255, 1.0)'
    };
    
    this.drawRangeBase(ctx, t, theme);
    this.drawAtmosphericControl(ctx, t);
  },

  // Tier 4: Weather Station
  tier4(ctx, t, state) {
    const theme = {
      shell: '#102030', 
      panel: '#6abbff', 
      glass: '#051a3d', 
      rim: '#204066',
      accent: '#1199ff', 
      detail: '#021122', 
      handle: '#99ddff', 
      mute: '#051a3a',
      steam: 'rgba(50, 150, 255, 1.2)'
    };
    
    this.drawRangeBase(ctx, t, theme);
    this.drawWeatherStation(ctx, t);
  },

  // Tier 5: Climate Controller
  tier5(ctx, t, state) {
    const theme = {
      shell: '#001020', 
      panel: '#4a99ff', 
      glass: '#001a3d', 
      rim: '#103066',
      accent: '#0077ff', 
      detail: '#001122', 
      handle: '#77bbff', 
      mute: '#001a3a',
      steam: 'rgba(200, 220, 255, 1.5)'
    };
    
    this.drawRangeBase(ctx, t, theme);
    this.drawClimateController(ctx, t);
  },

  drawRangeBase(ctx, t, theme) {
    // Enhanced base with range-detection modifications
    
    // Animation - smooth and precise for range systems
    const chargeProg = Math.min(1, ((t._charge||0) / (t.chargeTime||2)) || 0);
    const isBarraging = (t._gatlingTime||0) > 0;
    
    let spinDelta;
    if (t.chargeShot) {
      if (isBarraging) {
        spinDelta = 0.6; // Controlled speed for precision
      } else {
        spinDelta = 0.02 + chargeProg * 0.3;
      }
    } else {
      spinDelta = 0.12; // Steady, measured speed
    }
    
    t._ring = (t._ring || 0) + spinDelta;
    t._steam = (t._steam || 0) + 0.025; // Slower, more controlled steam
    
    // Precise, mechanical hinge movement
    const baseHinge = 0.03;
    const tempo = Math.min(2, Math.max(0.5, t.fireRate / 3));
    const hinge = baseHinge + Math.sin(t._ring * tempo) * 0.04;

    // BODY - Sleeker design for range systems
    ctx.fillStyle = theme.shell;
    roundedRect(ctx, -19, -25, 38, 50, 10); // Slightly taller and more rounded
    ctx.strokeStyle = '#0a1520'; 
    ctx.lineWidth = 1.8; 
    ctx.strokeRect(-19, -25, 38, 50);

    // Detection array panels on sides
    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < 6; i++) {
      const y = -22 + i * 7;
      roundedRect(ctx, -21, y, 2, 5, 1);
      roundedRect(ctx, 19, y, 2, 5, 1);
    }
    ctx.globalAlpha = 1;

    // Advanced sensor array control panel
    ctx.fillStyle = theme.panel;
    roundedRect(ctx, -17, -12, 34, 16, 5);
    
    // Radar screen display
    ctx.fillStyle = theme.detail;
    roundedRect(ctx, -12, -10, 24, 12, 3);
    
    // Radar sweep
    ctx.save();
    ctx.translate(0, -4);
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 1;
    
    // Concentric circles
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, i * 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Sweep line
    ctx.rotate(t._ring * 2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(9, 0);
    ctx.stroke();
    ctx.restore();

    // Range indicator LEDs
    ctx.fillStyle = theme.accent;
    for (let i = 0; i < 4; i++) {
      const alpha = 0.3 + Math.sin(t._ring * 3 + i) * 0.3;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(-15 + i * 10, 8, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Enhanced window and detection chamber
    ctx.fillStyle = theme.rim;
    roundedRect(ctx, -17, 4, 34, 16, 6);
    
    ctx.save();
    ctx.translate(0, 12);
    ctx.rotate(hinge);
    ctx.fillStyle = theme.glass;
    roundedRect(ctx, -15, -6, 30, 12, 4);
    
    // Detection array chamber
    this.drawDetectionArray(ctx, t, theme);
    
    ctx.fillStyle = theme.handle;
    roundedRect(ctx, -11, 7, 22, 6, 3);
    ctx.restore();

    // Stabilized feet for precision
    ctx.fillStyle = '#05101a';
    roundedRect(ctx, -13, 21, 11, 3, 1.5);
    roundedRect(ctx, 2, 21, 11, 3, 1.5);
    
    // Detection field steam
    this.drawDetectionSteam(ctx, t, theme.steam);
  },

  drawDetectionArray(ctx, t, theme) {
    ctx.save();
    ctx.translate(0, 0);
    ctx.rotate(t._ring * 0.5); // Slower rotation for precision
    
    // Multi-ring detection array
    ctx.strokeStyle = theme.accent;
    
    // Outer detection ring
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.stroke();
    
    // Middle ring
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner ring
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    // Detection nodes
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.fillStyle = theme.accent;
      ctx.globalAlpha = 0.6 + Math.sin(t._ring * 2 + i) * 0.4;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * 10, Math.sin(angle) * 10, 1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  },

  drawAtmosphericControl(ctx, t) {
    // Wind current indicators
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = '#66ccff';
    ctx.lineWidth = 1.5;
    
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + t._ring * 0.5;
      const radius = 25 + Math.sin(t._ring * 2 + i) * 5;
      
      ctx.beginPath();
      ctx.arc(0, 0, radius, angle, angle + Math.PI / 2);
      ctx.stroke();
    }
    ctx.restore();
  },

  drawWeatherStation(ctx, t) {
    this.drawAtmosphericControl(ctx, t);
    
    // Weather monitoring rings
    ctx.save();
    ctx.globalAlpha = 0.2;
    
    for (let i = 0; i < 3; i++) {
      const radius = 30 + i * 8 + Math.sin(t._ring + i) * 3;
      ctx.strokeStyle = i % 2 ? '#4488ff' : '#66aaff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Weather data streams
    ctx.strokeStyle = '#88ccff';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + t._ring * 0.3;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 20, Math.sin(angle) * 20);
      ctx.lineTo(Math.cos(angle) * 50, Math.sin(angle) * 50);
      ctx.stroke();
    }
    ctx.restore();
  },

  drawClimateController(ctx, t) {
    this.drawWeatherStation(ctx, t);
    
    // Global climate control field
    ctx.save();
    ctx.globalAlpha = 0.15 + Math.sin(t._ring) * 0.1;
    
    // Massive control field
    ctx.strokeStyle = '#aaeeff';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const radius = 50 + i * 15;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Climate control beams
    ctx.strokeStyle = '#ccffff';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const pulse = Math.sin(t._ring * 2 + i * 0.5) * 20 + 60;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * pulse, Math.sin(angle) * pulse);
      ctx.stroke();
    }
    ctx.restore();
  },

  drawDetectionSteam(ctx, t, steamColor) {
    // Precise, controlled steam for detection systems
    const rise = (offset, phaseScale, x0, precision) => {
      ctx.save();
      ctx.translate(0, -23);
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = steamColor;
      ctx.lineWidth = 1.0 + precision * 0.3;
      const tphase = t._steam * phaseScale + offset;
      const yoff = -8 - (Math.sin(tphase) + 1) * 2; // More controlled
      ctx.beginPath();
      ctx.moveTo(x0, 0);
      ctx.quadraticCurveTo(x0 + 2, -5, x0, -10 + yoff);
      ctx.quadraticCurveTo(x0 - 3, -18 + yoff, x0, -28 + yoff);
      ctx.stroke();
      ctx.restore();
    };
    
    // More precise steam pattern
    rise(-0.2, 0.8, -10, 1.0);
    rise(0.0, 0.9, 0, 0.8);
    rise(0.2, 1.0, 10, 1.0);
  }
};