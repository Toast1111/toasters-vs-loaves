// @ts-nocheck
import { roundedRect } from '../../../../../../rendering/drawUtils';

// Path 2: Rapid Cycling - Tiers 3-5
// Radiation battery with ammo capacity and burst DPS focus
export const RapidCyclingVisuals = {
  
  // Tier 3: Energy Hoarder
  tier3(ctx, t, state) {
    const theme = {
      shell: '#402030', 
      panel: '#ff4080', 
      glass: '#3a0a2a', 
      rim: '#603050',
      accent: '#ff6090', 
      detail: '#300a20', 
      handle: '#ff70a0', 
      mute: '#400a30',
      energy: 'rgba(255, 96, 144, 0.8)'
    };
    
    this.drawCyclingBase(ctx, t, theme);
    this.drawEnergyHoarder(ctx, t);
  },

  // Tier 4: Dualwave Mode
  tier4(ctx, t, state) {
    const theme = {
      shell: '#501040', 
      panel: '#ff2080', 
      glass: '#4a0a3a', 
      rim: '#702060',
      accent: '#ff4090', 
      detail: '#400a30', 
      handle: '#ff50a0', 
      mute: '#500a40',
      energy: 'rgba(255, 64, 144, 1.0)'
    };
    
    this.drawCyclingBase(ctx, t, theme);
    this.drawDualwaveMode(ctx, t);
  },

  // Tier 5: Gamma Burst
  tier5(ctx, t, state) {
    const theme = {
      shell: '#600050', 
      panel: '#ff0080', 
      glass: '#5a0a4a', 
      rim: '#801070',
      accent: '#ff2090', 
      detail: '#500a40', 
      handle: '#ff30a0', 
      mute: '#600a50',
      energy: 'rgba(255, 32, 144, 1.2)'
    };
    
    this.drawCyclingBase(ctx, t, theme);
    this.drawGammaBurst(ctx, t);
  },

  drawCyclingBase(ctx, t, theme) {
    // Enhanced microwave base with energy storage and cycling systems
    
    // Animation state for energy cycling
    const currentEnergy = t.radiationCurrent || 0; // Use the actual current radiation
    const maxEnergy = t.radiationCapacity || 4;
    const energyPercent = Math.max(0, Math.min(1, currentEnergy / maxEnergy));
    const energyLevel = energyPercent;
    const cycleSpeed = (t.turboMagnetron ? 1.5 : 1.0);
    const isCharging = (t._rechargeTime || 0) > 0;
    
    t._cycle = (t._cycle || 0) + 0.1 * cycleSpeed;
    t._energy = (t._energy || 0) + 0.08 * cycleSpeed;
    t._burst = (t._burst || 0) + 0.12;
    
    // BODY - Robust microwave with energy storage modules (wider design)
    ctx.fillStyle = theme.shell;
    roundedRect(ctx, -28, -22, 56, 44, 7);
    ctx.strokeStyle = '#111'; 
    ctx.lineWidth = 2; 
    ctx.strokeRect(-28, -22, 56, 44);

    // Energy storage cells on sides (microwave-style) - brightness based on energy
    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = 0.7 * (0.3 + energyPercent * 0.7); // Dimmer with less energy
    const cellCount = t.radiationCapacity || 4;
    for (let i = 0; i < cellCount; i++) {
      const y = -16 + (i * 32 / cellCount);
      const height = 32 / cellCount - 2;
      
      // Left side cells
      roundedRect(ctx, -30, y, 3, height, 1.5);
      // Right side cells
      roundedRect(ctx, 27, y, 3, height, 1.5);
      
      // Energy level in cells (visible only when there's energy)
      if (i < energyLevel * cellCount && energyPercent > 0) {
        ctx.fillStyle = theme.energy.replace(/[\d.]+\)/, `${energyPercent})`);
        roundedRect(ctx, -29, y + 1, 1, height - 2, 0.5);
        roundedRect(ctx, 28, y + 1, 1, height - 2, 0.5);
        ctx.fillStyle = theme.accent;
      }
    }
    ctx.globalAlpha = 1;

    // Advanced control panel with energy readouts (RIGHT side)
    ctx.fillStyle = theme.panel;
    roundedRect(ctx, 18, -20, 8, 40, 3);
    
    // Energy capacity display (vertical bars) - brightness based on energy
    ctx.fillStyle = theme.detail;
    for (let i = 0; i < 10; i++) {
      const y = -16 + i * 3.2;
      roundedRect(ctx, 19, y, 6, 2, 0.5);
      
      // Active energy bars (only visible when there's energy)
      const barFill = Math.max(0, Math.min(1, (energyLevel * 10) - i));
      if (barFill > 0 && energyPercent > 0) {
        ctx.fillStyle = theme.accent;
        ctx.globalAlpha = energyPercent;
        roundedRect(ctx, 19.2, y + 0.2, 5.6, 1.6, 0.3);
        ctx.globalAlpha = 1;
        ctx.fillStyle = theme.detail;
      }
    }

    // Large microwave chamber with dual magnetron capability
    ctx.fillStyle = theme.rim;
    roundedRect(ctx, -26, -18, 42, 36, 5);
    
    // Energy-based interior glow
    this.drawEnergyGlowWindow(ctx, t, theme, energyPercent);
    
    // Enhanced microwave door mesh pattern (dimmer with less energy)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.4 * (0.5 + energyPercent * 0.5); // Dimmer with less energy
    for (let x = -22; x < 14; x += 1.5) {
      ctx.beginPath();
      ctx.moveTo(x, -14);
      ctx.lineTo(x, 14);
      ctx.stroke();
    }
    for (let y = -14; y < 14; y += 1.5) {
      ctx.beginPath();
      ctx.moveTo(-22, y);
      ctx.lineTo(14, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    
    // Dual magnetron system
    this.drawMagnetronArray(ctx, t, theme, energyPercent);
    
    // Microwave door handle with charging indicators
    ctx.fillStyle = theme.handle;
    roundedRect(ctx, -32, -14, 3, 28, 1.5);
    
    // Charging status LEDs on handle
    if (isCharging) {
      ctx.fillStyle = '#ffff80';
      for (let i = 0; i < 4; i++) {
        const y = -10 + i * 5;
        ctx.globalAlpha = 0.5 + Math.sin(t._cycle * 2 + i) * 0.5;
        ctx.beginPath();
        ctx.arc(-30.5, y, 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    
    // Heavy-duty base supports (appliance style)
    ctx.fillStyle = '#000';
    roundedRect(ctx, -24, 20, 12, 2, 1);
    roundedRect(ctx, -6, 20, 12, 2, 1);
    roundedRect(ctx, 12, 20, 12, 2, 1);
    
    // Energy cycling effects
    this.drawEnergyCycling(ctx, t, theme.energy, isCharging, energyPercent);
  },

  drawEnergyGlowWindow(ctx, t, theme, energyPercent) {
    // Pink energy glow for Rapid Cycling path
    if (energyPercent > 0) {
      const glowColor = `rgba(255, 107, 138, ${energyPercent * 0.6})`; // Pink theme for rapid cycling
      const brightGlow = `rgba(255, 77, 109, ${energyPercent * 0.8})`;
      
      // Create interior glow effect
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      
      // Large interior glow fill
      ctx.fillStyle = glowColor;
      roundedRect(ctx, -24, -16, 38, 32, 4);
      
      // Central bright spot for energy concentration
      const centerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 16);
      centerGlow.addColorStop(0, brightGlow);
      centerGlow.addColorStop(1, 'rgba(255, 107, 138, 0)');
      ctx.fillStyle = centerGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
    
    // Always draw the dark glass window
    ctx.fillStyle = energyPercent > 0.1 ? 'rgba(0, 0, 0, 0.3)' : theme.glass;
    roundedRect(ctx, -24, -16, 38, 32, 4);
  },

  drawMagnetronArray(ctx, t, theme, energyPercent) {
    ctx.save();
    ctx.translate(-5, 2); // Center in microwave chamber
    
    // Dual magnetron configuration for higher capacity (energy-based brightness)
    const magnetronPositions = t.dualWave ? [-6, 6] : [0];
    
    magnetronPositions.forEach((xPos, index) => {
      ctx.save();
      ctx.translate(xPos, 0);
      ctx.rotate(t._cycle * (1 + index * 0.3));
      
      // High-capacity magnetron core (energy-based visibility)
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.4 + energyPercent * 0.6; // Dimmer with less energy
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.stroke();
      
      // Enhanced magnetron vanes (more realistic count) - energy-based
      ctx.globalAlpha = energyPercent * 0.8;
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * 3, Math.sin(angle) * 3);
        ctx.lineTo(Math.cos(angle) * 6, Math.sin(angle) * 6);
        ctx.stroke();
      }
      
      ctx.restore();
    });
    
    // Energy coupling between magnetrons (if dualwave and energy > 0)
    if (t.dualWave && energyPercent > 0) {
      ctx.globalAlpha = 0.6 * energyPercent;
      ctx.strokeStyle = theme.energy;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-6, 0);
      ctx.lineTo(6, 0);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    
    ctx.restore();
  },

  drawEnergyHoarder(ctx, t) {
    // Energy hoarder - visible energy accumulation
    ctx.save();
    ctx.globalAlpha = 0.4;
    
    // Energy particles accumulating
    const particleCount = (t.radiationCapacity || 4) * 2;
    ctx.fillStyle = '#ff80c0';
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + t._energy;
      const dist = 12 + Math.sin(t._cycle + i * 0.5) * 3;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  },

  drawDualwaveMode(ctx, t) {
    // Dualwave mode - twin beam preparation
    ctx.save();
    
    // Twin targeting systems
    const beamPositions = [-8, 8];
    
    beamPositions.forEach((xPos, index) => {
      ctx.save();
      ctx.translate(xPos, 0);
      
      // Targeting beam
      const beamIntensity = Math.sin(t._burst + index * Math.PI) * 0.5 + 0.5;
      ctx.globalAlpha = 0.3 + beamIntensity * 0.4;
      ctx.strokeStyle = '#ff4080';
      ctx.lineWidth = 2.5;
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -35);
      ctx.stroke();
      
      // Beam focus point
      ctx.fillStyle = '#ff6090';
      ctx.beginPath();
      ctx.arc(0, -35, 2.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
    
    ctx.restore();
  },

  drawGammaBurst(ctx, t) {
    // Gamma burst - explosive chain lightning effects
    ctx.save();
    
    // Gamma charge building up
    const burstIntensity = Math.sin(t._burst * 1.5) * 0.4 + 0.6;
    ctx.globalAlpha = burstIntensity * 0.7;
    
    // Chain lightning preview
    ctx.strokeStyle = '#ff00c0';
    ctx.lineWidth = 3;
    
    // Main burst center
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.stroke();
    
    // Lightning branches
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + t._energy;
      const branchLength = 25 + Math.sin(t._cycle + i) * 8;
      
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 8, Math.sin(angle) * 8);
      
      // Jagged lightning path
      let currentX = Math.cos(angle) * 8;
      let currentY = Math.sin(angle) * 8;
      
      for (let j = 1; j <= 3; j++) {
        const progress = j / 3;
        const targetX = Math.cos(angle) * branchLength * progress;
        const targetY = Math.sin(angle) * branchLength * progress;
        
        // Add some randomness to lightning path
        const jitterX = targetX + (Math.sin(t._burst * 2 + i + j) * 3);
        const jitterY = targetY + (Math.cos(t._burst * 2 + i + j) * 3);
        
        ctx.lineTo(jitterX, jitterY);
        currentX = jitterX;
        currentY = jitterY;
      }
      ctx.stroke();
    }
    
    // Gamma radiation particles
    ctx.fillStyle = '#ffff00';
    ctx.globalAlpha = burstIntensity * 0.5;
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2 + t._energy * 2;
      const dist = 30 + Math.sin(t._burst * 3 + i) * 10;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  },

  drawEnergyCycling(ctx, t, color, isCharging, energyPercent) {
    // Energy cycling visualization (energy-based visibility)
    if (energyPercent === 0 && !isCharging) return; // No cycling effects when no energy
    
    ctx.save();
    ctx.globalAlpha = (isCharging ? 0.4 : 0.2) * (0.5 + energyPercent * 0.5);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    
    // Cycling energy rings (energy-based)
    for (let i = 0; i < 4; i++) {
      const phase = (t._cycle * 2 + i * Math.PI * 0.5) % (Math.PI * 2);
      const radius = 15 + i * 4 + Math.sin(phase) * 2;
      
      ctx.globalAlpha = (isCharging ? 0.4 : 0.2) * energyPercent;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Energy flow indicators (only when charging or has energy)
    if (isCharging || energyPercent > 0) {
      ctx.strokeStyle = '#ffff80';
      ctx.lineWidth = 2;
      ctx.globalAlpha = (isCharging ? 1 : 0.5) * energyPercent;
      
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + t._energy;
        const innerR = 20;
        const outerR = 30;
        
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR);
        ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }
};

// Export the render function
export function renderRapid_cyclingVisuals(ctx, tower, state) {
  const tierLevel = tower.tier || 3; // Default to tier 3 if not specified
  
  if (tierLevel >= 5 && RapidCyclingVisuals.tier5) {
    RapidCyclingVisuals.tier5(ctx, tower, state);
  } else if (tierLevel >= 4 && RapidCyclingVisuals.tier4) {
    RapidCyclingVisuals.tier4(ctx, tower, state);
  } else if (tierLevel >= 3 && RapidCyclingVisuals.tier3) {
    RapidCyclingVisuals.tier3(ctx, tower, state);
  }
}
