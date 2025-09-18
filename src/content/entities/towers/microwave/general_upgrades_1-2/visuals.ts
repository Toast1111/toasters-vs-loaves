// @ts-nocheck
import { roundedRect } from '../../../../../rendering/drawUtils';

// General visual system for microwave tiers 1-2 (all paths)
// Base microwave design before paths diverge into specialized visuals
export const GeneralMicrowaveVisuals = {
  
  // Base visual (no upgrades) - basic microwave design
  base(ctx, t, state) {
    // Default theme for base microwave
    const theme = {
      shell: '#3a3a50',     // Dark blue-gray shell
      panel: '#5a5a80',     // Control panel
      glass: '#2a2a40',     // Door window
      rim: '#4a4a60',       // Door rim
      accent: '#6a6aa0',    // Accent elements
      detail: '#1a1a30',    // Dark details
      handle: '#7a7ab0',    // Door handle
      feet: '#0a0a20',      // Base feet
      radiation: 'rgba(106, 106, 160, 0.3)' // Subtle radiation glow
    };
    
    GeneralMicrowaveVisuals.drawBasicMicrowave(ctx, t, theme);
  },

  // Path 0 Tier 1-2: Early pierce upgrades - purple radiation theme
  path0_tier12(ctx, t, state) {
    const theme = {
      shell: '#4a3050',     // Purple-tinted shell
      panel: '#6a5080',     // Purple control panel
      glass: '#3a2040',     // Darker window
      rim: '#5a4060',       // Purple rim
      accent: '#8a60a0',    // Purple accents
      detail: '#2a1030',    // Dark purple details
      handle: '#9a70b0',    // Purple handle
      feet: '#1a0020',      // Dark feet
      radiation: 'rgba(138, 96, 160, 0.5)' // Purple radiation
    };
    
    GeneralMicrowaveVisuals.drawBasicMicrowave(ctx, t, theme);
    GeneralMicrowaveVisuals.drawPierceEnhancements(ctx, t, theme);
  },

  // Path 1 Tier 1-2: Early range/network upgrades - blue theme
  path1_tier12(ctx, t, state) {
    const theme = {
      shell: '#305050',     // Blue-teal shell
      panel: '#5080a0',     // Blue control panel
      glass: '#204040',     // Blue-tinted window
      rim: '#406060',       // Blue rim
      accent: '#60a0c0',    // Blue accents
      detail: '#103030',    // Dark blue details
      handle: '#70b0d0',    // Blue handle
      feet: '#002020',      // Dark feet
      radiation: 'rgba(96, 160, 192, 0.5)' // Blue radiation
    };
    
    GeneralMicrowaveVisuals.drawBasicMicrowave(ctx, t, theme);
    GeneralMicrowaveVisuals.drawNetworkEnhancements(ctx, t, theme);
  },

  // Path 2 Tier 1-2: Early capacity/energy upgrades - pink theme
  path2_tier12(ctx, t, state) {
    const theme = {
      shell: '#503040',     // Pink-tinted shell
      panel: '#805060',     // Pink control panel
      glass: '#402030',     // Pink-tinted window
      rim: '#604050',       // Pink rim
      accent: '#a060a0',    // Pink accents
      detail: '#301020',    // Dark pink details
      handle: '#b070b0',    // Pink handle
      feet: '#200010',      // Dark feet
      radiation: 'rgba(160, 96, 160, 0.5)' // Pink radiation
    };
    
    GeneralMicrowaveVisuals.drawBasicMicrowave(ctx, t, theme);
    GeneralMicrowaveVisuals.drawEnergyEnhancements(ctx, t, theme);
  },

  // Base microwave structure
  drawBasicMicrowave(ctx, t, theme) {
    // Animation state for basic microwave (minimal animations)
    t._display = (t._display || 0) + 0.02;     // Display flicker only
    
    // Calculate energy level for interior glow
    const currentEnergy = t.radiationCurrent || 0; // Use the actual current radiation
    const maxEnergy = t.radiationCapacity || 4;
    const energyPercent = Math.max(0, Math.min(1, currentEnergy / maxEnergy));
    
    // BODY (main microwave shell) - more rectangular, wider than tall
    ctx.fillStyle = theme.shell;
    roundedRect(ctx, -22, -16, 44, 32, 4); // Wider, more rectangular shape
    
    // Stroke outline
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-22, -16, 44, 32);

    // Air vents on the right side (typical microwave feature)
    ctx.fillStyle = '#1a1a2a';
    for (let i = 0; i < 8; i++) {
      const y = -12 + i * 3;
      roundedRect(ctx, 18, y, 3, 1.5, 0.5);
    }

    // Control panel on the RIGHT side (like real microwaves)
    ctx.fillStyle = theme.panel;
    roundedRect(ctx, 12, -14, 8, 28, 2);
    
    // Digital display at top of control panel (simple, no text)
    ctx.fillStyle = '#000';
    roundedRect(ctx, 13, -13, 6, 3, 1);
    
    // Display indicators (simple dots instead of text)
    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = 0.8 + Math.sin(t._display * 4) * 0.2;
    for (let i = 0; i < 4; i++) {
      const x = 14 + i * 1.2;
      ctx.beginPath();
      ctx.arc(x, -11.5, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Number pad buttons (3x4 grid)
    ctx.fillStyle = theme.detail;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (row * 3 + col < 10) { // Only show 10 buttons (0-9)
          const x = 13 + col * 2;
          const y = -8 + row * 3;
          roundedRect(ctx, x, y, 1.5, 1.5, 0.3);
        }
      }
    }

    // Start/Stop buttons
    ctx.fillStyle = '#2a5a2a'; // Green start
    roundedRect(ctx, 13, 8, 2.5, 2, 0.5);
    ctx.fillStyle = '#5a2a2a'; // Red stop
    roundedRect(ctx, 16.5, 8, 2.5, 2, 0.5);

    // Door frame (LEFT side - most of the microwave)
    ctx.fillStyle = theme.rim;
    roundedRect(ctx, -20, -14, 30, 26, 3);
    
    // Large door window with energy-based interior glow
    this.drawEnergyGlowWindow(ctx, t, theme, energyPercent);
    
    // Mesh pattern inside window (microwave door mesh)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;
    for (let x = -16; x < 8; x += 2) {
      ctx.beginPath();
      ctx.moveTo(x, -10);
      ctx.lineTo(x, 8);
      ctx.stroke();
    }
    for (let y = -10; y < 8; y += 2) {
      ctx.beginPath();
      ctx.moveTo(-16, y);
      ctx.lineTo(8, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    
    // Static magnetron (no rotation until higher tiers)
    ctx.save();
    ctx.translate(-5, -1); // Position in center of cooking chamber
    
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.4 + energyPercent * 0.4; // Brightness based on energy
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.stroke();
    
    // Static magnetron vanes (no rotation)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 3, Math.sin(angle) * 3);
      ctx.lineTo(Math.cos(angle) * 5, Math.sin(angle) * 5);
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;

    // Door handle (vertical, on the left edge)
    ctx.fillStyle = theme.handle;
    roundedRect(ctx, -22, -8, 2, 16, 1);

    // Static turntable inside (no rotation until higher tiers)
    ctx.save();
    ctx.translate(-5, 2);
    
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3 + energyPercent * 0.3; // Brightness based on energy
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.stroke();
    
    // Static turntable support spokes
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * 6, Math.sin(angle) * 6);
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;

    // Base feet (small, like appliance feet)
    ctx.fillStyle = theme.feet;
    roundedRect(ctx, -18, 14, 6, 2, 1);
    roundedRect(ctx, -6, 14, 6, 2, 1);
    roundedRect(ctx, 6, 14, 6, 2, 1);
    
    // Energy-based radiation glow
    if (energyPercent > 0) {
      ctx.save();
      ctx.globalAlpha = 0.1 * energyPercent;
      ctx.strokeStyle = theme.radiation;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(-5, -1, 20 + energyPercent * 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  },

  // Energy-based interior glow window
  drawEnergyGlowWindow(ctx, t, theme, energyPercent) {
    // Base window glass (dark when no energy)
    const baseGlass = theme.glass;
    
    // Calculate glow color based on energy level
    // Dark at 0 energy, bright neon yellow at full energy
    const glowIntensity = energyPercent;
    const yellowComponent = Math.floor(255 * glowIntensity);
    const greenComponent = Math.floor(200 * glowIntensity);
    const redComponent = Math.floor(100 * glowIntensity);
    
    // Create energy glow color
    const energyGlow = `rgba(${yellowComponent}, ${greenComponent}, ${redComponent}, ${glowIntensity * 0.8})`;
    
    // Draw base window
    ctx.fillStyle = baseGlass;
    roundedRect(ctx, -18, -12, 26, 22, 2);
    
    // Add energy glow overlay if there's energy
    if (energyPercent > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen'; // Additive blending for glow effect
      ctx.fillStyle = energyGlow;
      roundedRect(ctx, -18, -12, 26, 22, 2);
      ctx.restore();
      
      // Add extra bright center glow for full energy
      if (energyPercent > 0.5) {
        ctx.save();
        ctx.globalAlpha = (energyPercent - 0.5) * 2 * 0.4; // Extra glow when over 50%
        const centerGlow = `rgba(255, 255, 100, 1)`;
        ctx.fillStyle = centerGlow;
        roundedRect(ctx, -12, -8, 14, 14, 2); // Smaller central glow
        ctx.restore();
      }
    }
  },

  // Subtle pierce enhancements for path 0 tiers 1-2
  drawPierceEnhancements(ctx, t, theme) {
    // Pierce focus indicators (static, no animation)
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = '#a060ff';
    ctx.lineWidth = 1;
    
    // Static focused beam preview
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -25);
    ctx.stroke();
    
    ctx.fillStyle = '#a060ff';
    ctx.beginPath();
    ctx.arc(0, -25, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  },

  // Subtle network enhancements for path 1 tiers 1-2
  drawNetworkEnhancements(ctx, t, theme) {
    // Small antenna additions (static)
    ctx.save();
    ctx.fillStyle = '#60a0ff';
    ctx.globalAlpha = 0.7;
    
    // Mini antennas on top (static)
    for (let i = 0; i < 3; i++) {
      const x = -6 + i * 6;
      roundedRect(ctx, x, -22, 1, 3, 0.5);
      
      // Antenna tips
      ctx.beginPath();
      ctx.arc(x + 0.5, -22, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Static range indicator
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = '#60a0ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
  },

  // Subtle energy enhancements for path 2 tiers 1-2
  drawEnergyEnhancements(ctx, t, theme) {
    // Energy capacity indicators (static)
    ctx.save();
    ctx.fillStyle = '#ff60a0';
    ctx.globalAlpha = 0.6;
    
    // Static capacity cells on sides
    for (let i = 0; i < 2; i++) {
      const y = -5 + i * 10;
      roundedRect(ctx, -20, y, 2, 5, 1);
      roundedRect(ctx, 18, y, 2, 5, 1);
    }
    
    // Static energy indicators
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = '#ff60a0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const radius = 15;
      
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 10, Math.sin(angle) * 10);
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      ctx.stroke();
    }
    
    ctx.restore();
  }
};
