// @ts-nocheck
import { roundedRect } from '../../../../drawUtils';

// Path 2: Cyclone Generation - Tiers 3-5
// Advanced wind, tornado, and reality-bending visual effects based on HTML prototype
export const CycloneGenerationVisuals = {
  
  // Tier 3: Tornado Generator  
  tier3(ctx, t, state) {
    const theme = {
      shell: '#2b2f3c', 
      panel: '#b9acd2', 
      glass: '#141a2b', 
      rim: '#3a3550',
      accent: '#6a5aed', 
      detail: '#0b0f18', 
      handle: '#cfc7e6', 
      stroke: '#1e2335',
      steam: 'rgba(191, 198, 255, 0.7)'
    };
    
    CycloneGenerationVisuals.drawHTMLStyleBase(ctx, t, theme, 1.0);
    CycloneGenerationVisuals.drawTornadoEffects(ctx, t, theme);
  },

  // Tier 4: Hurricane Engine
  tier4(ctx, t, state) {
    const theme = {
      shell: '#262f37', 
      panel: '#adb8e8', 
      glass: '#141f30', 
      rim: '#33405c',
      accent: '#82a7ff', 
      detail: '#0b1320', 
      handle: '#d2dbf5', 
      stroke: '#1e2b45',
      steam: 'rgba(198, 226, 255, 0.85)'
    };
    
    CycloneGenerationVisuals.drawHTMLStyleBase(ctx, t, theme, 1.35);
    CycloneGenerationVisuals.drawHurricaneEffects(ctx, t, theme);
  },

  // Tier 5: Atmospheric Devastator
  tier5(ctx, t, state) {
    const theme = {
      shell: '#202b34', 
      panel: '#8aaef5', 
      glass: '#0f1c33', 
      rim: '#2c4a72',
      accent: '#9ccaff', 
      detail: '#081223', 
      handle: '#e0edff', 
      stroke: '#16263f',
      steam: 'rgba(214, 236, 255, 0.95)'
    };
    
    CycloneGenerationVisuals.drawHTMLStyleBase(ctx, t, theme, 1.6);
    CycloneGenerationVisuals.drawAtmosphericDevastatorEffects(ctx, t, theme);
  },

  // Base airfryer structure matching the HTML prototype design
  drawHTMLStyleBase(ctx, t, theme, speedScale) {
    // Animation state matching HTML prototype timing
    const chargeProg = Math.min(1, ((t._charge||0) / (t.chargeTime||2)) || 0);
    const isBarraging = (t._gatlingTime||0) > 0;
    
    let spinDelta;
    if (t.chargeShot) {
      if (isBarraging) {
        spinDelta = 0.9 * speedScale; // Fast but controlled
      } else {
        spinDelta = (0.02 + chargeProg * 0.4) * speedScale;
      }
    } else {
      spinDelta = 0.18 * speedScale; // Steady rotation like HTML
    }
    
    t._ring = (t._ring || 0) + spinDelta;
    t._steam = (t._steam || 0) + 0.03 * speedScale;
    
    // Gentle hinge movement like HTML prototype
    const hinge = 0.04 + Math.sin(t._ring * 0.8) * 0.05;

    // BODY (main shell) - scaled from HTML viewBox proportions
    ctx.fillStyle = theme.shell;
    roundedRect(ctx, -18, -24, 36, 48, 9); // Maintaining game scale
    ctx.strokeStyle = theme.stroke; 
    ctx.lineWidth = 1.5; 
    ctx.strokeRect(-18, -24, 36, 48);

    // Side highlights (matching HTML .sides)
    ctx.globalAlpha = 0.18; 
    ctx.fillStyle = '#ffffff';
    roundedRect(ctx, -17, -20, 1.5, 40, 1);
    roundedRect(ctx, 15.5, -20, 1.5, 40, 1);
    ctx.globalAlpha = 1;

    // TOP PLATE (matching HTML #topPlate)
    ctx.fillStyle = '#343a4e'; 
    roundedRect(ctx, -16, -22, 32, 8, 2);
    
    // Vents (matching HTML #vents pattern)
    ctx.fillStyle = '#121726';
    const ventWidth = 2.5, ventHeight = 1.5, ventSpacing = 3.5;
    for (let i = 0; i < 9; i++) {
      const x = -14 + i * ventSpacing;
      roundedRect(ctx, x, -19, ventWidth, ventHeight, 0.75);
    }

    // CONTROL PANEL (matching HTML #panelGroup)
    ctx.fillStyle = theme.panel; 
    roundedRect(ctx, -16, -8, 32, 8, 2);
    
    // Central display
    ctx.fillStyle = theme.detail; 
    roundedRect(ctx, -5, -7, 10, 4, 1);
    
    // Side knobs
    ctx.fillStyle = '#ececf5';
    ctx.beginPath();
    ctx.arc(-12, -4, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(12, -4, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Knob indicators
    ctx.fillStyle = '#8d93a6';
    roundedRect(ctx, -13, -5.5, 1, 2, 0.5);
    roundedRect(ctx, 11, -5.5, 1, 2, 0.5);

    // WINDOW FRAME (matching HTML #window)
    ctx.fillStyle = theme.rim; 
    roundedRect(ctx, -16, 0, 32, 16, 3);

    // BASKET (hinged, matching HTML #basket behavior)
    ctx.save();
    ctx.translate(0, 8); // Hinge point at bottom of window
    ctx.rotate(hinge);
    
    // Basket glass
    ctx.fillStyle = theme.glass; 
    roundedRect(ctx, -14, -6, 28, 12, 2);
    
    // CIRCULATION RING (matching HTML #ring with dashed pattern)
    ctx.save();
    ctx.translate(0, 3); // Ring center
    ctx.rotate(t._ring);
    
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]); // Matching HTML stroke-dasharray="10 8" scaled
    ctx.beginPath();
    ctx.arc(0, 0, 9.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Charge progress indicator
    if ((t.chargeShot || 0) && (t._gatlingTime||0) <= 0) {
      const prog = Math.min(1, ((t._charge||0) / (t.chargeTime||2)) || 0);
      if (prog > 0) {
        ctx.strokeStyle = '#ffaa44';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 11.5, -Math.PI/2, -Math.PI/2 + prog * Math.PI * 2);
        ctx.stroke();
      }
    }
    
    // Barrage indicator
    if ((t._gatlingTime||0) > 0) {
      ctx.strokeStyle = '#ff6666';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.restore();
    
    // HANDLE (matching HTML #handle)
    ctx.fillStyle = theme.handle; 
    roundedRect(ctx, -8, 7, 16, 4, 2);
    
    ctx.restore();

    // FEET (matching HTML #feet)
    ctx.fillStyle = '#0c101c'; 
    roundedRect(ctx, -14, 20, 6, 2, 1); 
    roundedRect(ctx, 8, 20, 6, 2, 1);

    // STEAM WISPS (matching HTML #steam module)
    CycloneGenerationVisuals.drawHTMLStyleSteam(ctx, t, theme.steam, speedScale);
  },

  // Steam system matching HTML prototype
  drawHTMLStyleSteam(ctx, t, steamColor, speedScale) {
    ctx.save();
    ctx.translate(0, -22); // Position above top plate
    
    // Three wisps with different phases (matching HTML .w1, .w2, .w3)
    const drawWisp = (xOffset, phaseOffset, scaleOffset) => {
      ctx.save();
      ctx.translate(xOffset, 0);
      
      // Phase calculation for smooth rising motion
      const phase = (t._steam * speedScale + phaseOffset) % (Math.PI * 2);
      const riseOffset = Math.sin(phase) * -8;
      const alpha = (Math.sin(phase + Math.PI/2) + 1) * 0.5; // 0 to 1
      
      ctx.globalAlpha = alpha * 0.7;
      ctx.strokeStyle = steamColor;
      ctx.lineWidth = 1.2;
      
      // Wispy path matching HTML path curves
      ctx.beginPath();
      ctx.moveTo(0, riseOffset);
      ctx.quadraticCurveTo(3, riseOffset - 8, 0, riseOffset - 16);
      ctx.quadraticCurveTo(-4, riseOffset - 24, 0, riseOffset - 32);
      ctx.stroke();
      
      ctx.restore();
    };
    
    // Three wisps at different positions and phases
    drawWisp(-8, 0, 1.0);      // Left wisp
    drawWisp(0, 0.3, 1.1);     // Center wisp  
    drawWisp(8, 0.6, 1.2);     // Right wisp
    
    ctx.restore();
  },

  // Tier 3 specific effects
  drawTornadoEffects(ctx, t, theme) {
    // Subtle tornado vortex around the airfryer
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 1.5;
    
    for (let i = 0; i < 2; i++) {
      const radius = 25 + i * 8;
      const spiralOffset = t._ring * (1 + i * 0.2);
      
      ctx.beginPath();
      for (let j = 0; j < 30; j++) {
        const angle = (j / 30) * Math.PI * 3 + spiralOffset;
        const r = radius + Math.sin(j * 0.3 + spiralOffset) * 3;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  },

  // Tier 4 specific effects
  drawHurricaneEffects(ctx, t, theme) {
    CycloneGenerationVisuals.drawTornadoEffects(ctx, t, theme);
    
    // Hurricane eye wall effect
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 3; i++) {
      const radius = 35 + i * 6;
      const rotationSpeed = 0.8 + i * 0.1;
      
      ctx.save();
      ctx.rotate(t._ring * rotationSpeed);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 1.5); // 3/4 circle for hurricane band
      ctx.stroke();
      ctx.restore();
    }
    
    // Outer detection pulses
    const pulseRadius = 45 + Math.sin(t._steam * 0.8) * 8;
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(0, 0, pulseRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
  },

  // Tier 5 specific effects
  drawAtmosphericDevastatorEffects(ctx, t, theme) {
    CycloneGenerationVisuals.drawHurricaneEffects(ctx, t, theme);
    
    // Global atmospheric control field
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 1.5;
    
    // Massive control rings
    for (let i = 0; i < 4; i++) {
      const radius = 55 + i * 12;
      const pulse = Math.sin(t._ring * 0.5 + i * 0.5) * 5;
      ctx.beginPath();
      ctx.arc(0, 0, radius + pulse, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Reality distortion beams
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + t._ring * 0.3;
      const beamLength = 60 + Math.sin(t._ring * 2 + i) * 15;
      ctx.globalAlpha = 0.1 + Math.sin(t._ring * 3 + i) * 0.1;
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * beamLength, Math.sin(angle) * beamLength);
      ctx.stroke();
    }
    
    ctx.restore();
  }
};