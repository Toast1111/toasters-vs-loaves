// @ts-nocheck
import { roundedRect } from '../../../../../../rendering/drawUtils';

// Path 0: Wave Power - Tiers 3-5
// Pierce specialist with radiation lance and nuclear effects
export const WavePowerVisuals = {
  
  // Tier 3: Overload Cooking
  tier3(ctx, t, state) {
    const theme = {
      shell: '#2a2040', 
      panel: '#5040ff', 
      glass: '#1a0a3a', 
      rim: '#403060',
      accent: '#6060ff', 
      detail: '#150a30', 
      handle: '#7070ff', 
      mute: '#200a40',
      radiation: 'rgba(96, 96, 255, 0.8)'
    };
    
    this.drawWaveBase(ctx, t, theme);
    this.drawOverloadEffects(ctx, t);
  },

  // Tier 4: Radiation Lance
  tier4(ctx, t, state) {
    const theme = {
      shell: '#3a1050', 
      panel: '#7030ff', 
      glass: '#2a0a4a', 
      rim: '#502070',
      accent: '#8040ff', 
      detail: '#250a40', 
      handle: '#9050ff', 
      mute: '#300a50',
      radiation: 'rgba(128, 64, 255, 1.0)'
    };
    
    this.drawWaveBase(ctx, t, theme);
    this.drawRadiationLance(ctx, t);
  },

  // Tier 5: Nuclear Reheat
  tier5(ctx, t, state) {
    const theme = {
      shell: '#4a0060', 
      panel: '#9020ff', 
      glass: '#3a0a5a', 
      rim: '#601080',
      accent: '#a030ff', 
      detail: '#350a50', 
      handle: '#b040ff', 
      mute: '#400a60',
      radiation: 'rgba(160, 48, 255, 1.2)'
    };
    
    this.drawWaveBase(ctx, t, theme);
    this.drawNuclearReheat(ctx, t);
  },

  drawWaveBase(ctx, t, theme) {
    // Enhanced microwave base with radiation elements
    
    // Animation state for radiation charging
    const chargeProg = Math.min(1, ((t._charge||0) / (t.chargeTime||2)) || 0);
    
    // Calculate energy level for interior glow
    const currentEnergy = t.radiationCurrent || 0; // Use the actual current radiation
    const maxEnergy = t.radiationCapacity || 4;
    const energyPercent = Math.max(0, Math.min(1, currentEnergy / maxEnergy));
    
    t._wave = (t._wave || 0) + 0.08;
    t._radiation = (t._radiation || 0) + 0.05;
    
    // BODY - Enhanced microwave design (wider, more rectangular)
    ctx.fillStyle = theme.shell;
    roundedRect(ctx, -24, -18, 48, 36, 5);
    ctx.strokeStyle = '#111'; 
    ctx.lineWidth = 1.5; 
    ctx.strokeRect(-24, -18, 48, 36);

    // Radiation wave guides on sides and top
    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = 0.6 + energyPercent * 0.4; // Brighter with more energy
    for (let i = 0; i < 4; i++) {
      const y = -12 + i * 6;
      roundedRect(ctx, -26, y, 3, 4, 1.5);
      roundedRect(ctx, 23, y, 3, 4, 1.5);
    }
    // Top radiation emitters
    for (let i = 0; i < 5; i++) {
      const x = -16 + i * 8;
      roundedRect(ctx, x, -20, 4, 2, 1);
    }
    ctx.globalAlpha = 1;

    // Enhanced control panel on the RIGHT side
    ctx.fillStyle = theme.panel;
    roundedRect(ctx, 14, -16, 8, 32, 2);
    
    // Radiation level indicators (vertical bar graph)
    ctx.fillStyle = theme.detail;
    for (let i = 0; i < 6; i++) {
      const y = -12 + i * 4;
      roundedRect(ctx, 15, y, 6, 2, 0.5);
      
      if (i < energyPercent * 6) {
        ctx.fillStyle = theme.accent;
        roundedRect(ctx, 15.5, y + 0.2, 5, 1.6, 0.3);
        ctx.fillStyle = theme.detail;
      }
    }

    // Large door window (main microwave feature)
    ctx.fillStyle = theme.rim;
    roundedRect(ctx, -22, -16, 34, 30, 4);
    
    // Energy-based interior glow
    this.drawEnergyGlowWindow(ctx, t, theme, energyPercent);
    
    // Enhanced mesh pattern for radiation containment
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.4;
    for (let x = -18; x < 10; x += 1.5) {
      ctx.beginPath();
      ctx.moveTo(x, -12);
      ctx.lineTo(x, 10);
      ctx.stroke();
    }
    for (let y = -12; y < 10; y += 1.5) {
      ctx.beginPath();
      ctx.moveTo(-18, y);
      ctx.lineTo(10, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    
    // Wave emission chamber (center of microwave)
    this.drawWaveEmitter(ctx, t, theme, energyPercent);
    
    // Microwave door handle (vertical, left side)
    ctx.fillStyle = theme.handle;
    roundedRect(ctx, -26, -10, 2, 20, 1);

    // Base support (appliance feet)
    ctx.fillStyle = '#000';
    roundedRect(ctx, -20, 16, 8, 2, 1);
    roundedRect(ctx, -4, 16, 8, 2, 1);
    roundedRect(ctx, 12, 16, 8, 2, 1);
    
    // Radiation emission effects (energy-based)
    this.drawRadiationWaves(ctx, t, theme.radiation, energyPercent);
  },

  drawWaveEmitter(ctx, t, theme, energyPercent) {
    ctx.save();
    ctx.translate(-5, 0); // Center in the microwave chamber
    
    // Central magnetron with rotating elements (spins based on energy)
    ctx.save();
    if (energyPercent > 0) {
      ctx.rotate(t._wave * energyPercent); // Spin speed based on energy
    }
    
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4 + energyPercent * 0.6; // Brightness based on energy
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.stroke();
    
    // Magnetron vanes (realistic microwave count)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 4, Math.sin(angle) * 4);
      ctx.lineTo(Math.cos(angle) * 8, Math.sin(angle) * 8);
      ctx.stroke();
    }
    ctx.restore();
    
    // Wave field pattern radiating from magnetron (energy-based intensity)
    ctx.globalAlpha = 0.4 * energyPercent;
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const radius = 10 + i * 3 + Math.sin(t._radiation * 2 + i) * 2;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    
    ctx.restore();
  },

  // Energy-based interior glow window for wave power path
  drawEnergyGlowWindow(ctx, t, theme, energyPercent) {
    // Base window glass (dark when no energy)
    const baseGlass = theme.glass;
    
    // Calculate intense radiation glow based on energy level
    // Purple/violet theme for wave power path
    const glowIntensity = energyPercent;
    const purpleComponent = Math.floor(255 * glowIntensity);
    const blueComponent = Math.floor(150 * glowIntensity);
    const redComponent = Math.floor(200 * glowIntensity);
    
    // Create radiation glow color (purple/violet)
    const radiationGlow = `rgba(${redComponent}, ${blueComponent}, ${purpleComponent}, ${glowIntensity * 0.9})`;
    
    // Draw base window
    ctx.fillStyle = baseGlass;
    roundedRect(ctx, -20, -14, 30, 26, 3);
    
    // Add radiation glow overlay if there's energy
    if (energyPercent > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen'; // Additive blending for glow effect
      ctx.fillStyle = radiationGlow;
      roundedRect(ctx, -20, -14, 30, 26, 3);
      ctx.restore();
      
      // Add extra bright center glow for full energy
      if (energyPercent > 0.7) {
        ctx.save();
        ctx.globalAlpha = (energyPercent - 0.7) * 3.33 * 0.5; // Extra glow when over 70%
        const centerGlow = `rgba(255, 150, 255, 1)`;
        ctx.fillStyle = centerGlow;
        roundedRect(ctx, -15, -9, 20, 16, 2); // Smaller central glow
        ctx.restore();
      }
    }
  },

  drawOverloadEffects(ctx, t) {
    // Overload cooking - intense heat and radiation patterns
    ctx.save();
    ctx.globalAlpha = 0.5;
    
    // Overload sparks
    ctx.fillStyle = '#ffff80';
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + t._wave;
      const dist = 20 + Math.sin(t._radiation * 3 + i) * 4;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  },

  drawRadiationLance(ctx, t) {
    // Radiation lance - focused beam preparation
    ctx.save();
    
    // Lance charging indicator
    const chargeIntensity = Math.sin(t._wave * 4) * 0.5 + 0.5;
    ctx.globalAlpha = 0.3 + chargeIntensity * 0.4;
    
    // Focused beam preview
    ctx.strokeStyle = '#ff40ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -30);
    ctx.stroke();
    
    // Lance tips
    ctx.fillStyle = '#ff60ff';
    ctx.beginPath();
    ctx.arc(0, -30, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  },

  drawNuclearReheat(ctx, t) {
    // Nuclear reheat - explosive aftermath effects
    ctx.save();
    
    // Nuclear glow
    const glowIntensity = Math.sin(t._radiation * 2) * 0.3 + 0.7;
    ctx.globalAlpha = glowIntensity * 0.6;
    
    // Radiation burst rings
    ctx.strokeStyle = '#ff00ff';
    for (let i = 0; i < 3; i++) {
      ctx.lineWidth = 3 - i;
      const radius = 25 + i * 8 + Math.sin(t._wave * 2 + i * 2) * 4;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Nuclear particles
    ctx.fillStyle = '#ffff00';
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + t._radiation;
      const dist = 30 + Math.sin(t._wave * 3 + i) * 8;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  },

  drawRadiationWaves(ctx, t, color, energyPercent) {
    // Ambient radiation emission (energy-based intensity)
    if (energyPercent > 0) {
      ctx.save();
      ctx.globalAlpha = 0.2 * energyPercent;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      
      for (let i = 0; i < 4; i++) {
        const radius = 25 + i * 6 + Math.sin(t._radiation + i) * 3;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      ctx.restore();
    }
  }
};

// Export the render function
export function renderWave_powerVisuals(ctx, tower, state) {
  const tierLevel = tower.tier || 3; // Default to tier 3 if not specified
  
  if (tierLevel >= 5 && WavePowerVisuals.tier5) {
    WavePowerVisuals.tier5(ctx, tower, state);
  } else if (tierLevel >= 4 && WavePowerVisuals.tier4) {
    WavePowerVisuals.tier4(ctx, tower, state);
  } else if (tierLevel >= 3 && WavePowerVisuals.tier3) {
    WavePowerVisuals.tier3(ctx, tower, state);
  }
}
