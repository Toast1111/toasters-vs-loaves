// @ts-nocheck
import { roundedRect } from '../../../../../../rendering/drawUtils';

// Path 1: Network Coverage - Tiers 3-5
// Control specialist with range, utility, and area effects
export const NetworkCoverageVisuals = {
  
  // Tier 3: Static Shock
  tier3(ctx, t, state) {
    const theme = {
      shell: '#203040', 
      panel: '#4080ff', 
      glass: '#0a1a3a', 
      rim: '#305060',
      accent: '#60a0ff', 
      detail: '#0a1530', 
      handle: '#70b0ff', 
      mute: '#0a2040',
      electric: 'rgba(96, 160, 255, 0.7)'
    };
    
    this.drawNetworkBase(ctx, t, theme);
    this.drawStaticShock(ctx, t);
  },

  // Tier 4: Pulse Microwave
  tier4(ctx, t, state) {
    const theme = {
      shell: '#104050', 
      panel: '#2090ff', 
      glass: '#0a2a4a', 
      rim: '#206070',
      accent: '#40b0ff', 
      detail: '#0a2540', 
      handle: '#50c0ff', 
      mute: '#0a3050',
      electric: 'rgba(64, 176, 255, 0.9)'
    };
    
    this.drawNetworkBase(ctx, t, theme);
    this.drawPulseMicrowave(ctx, t);
  },

  // Tier 5: Orbital Oven
  tier5(ctx, t, state) {
    const theme = {
      shell: '#005060', 
      panel: '#00a0ff', 
      glass: '#0a3a5a', 
      rim: '#107080',
      accent: '#20c0ff', 
      detail: '#0a3550', 
      handle: '#30d0ff', 
      mute: '#0a4060',
      electric: 'rgba(32, 192, 255, 1.1)'
    };
    
    this.drawNetworkBase(ctx, t, theme);
    this.drawOrbitalOven(ctx, t);
  },

  drawNetworkBase(ctx, t, theme) {
    // Enhanced microwave base with networking/antenna elements
    
    // Animation state for network pulses
    const pulseProgress = Math.sin((t._networkTime || 0) * 2) * 0.5 + 0.5;
    const rangeRadius = t.range || 190;
    
    // Calculate energy level for interior glow
    const currentEnergy = t.radiationCurrent || 0; // Use the actual current radiation
    const maxEnergy = t.radiationCapacity || 4;
    const energyPercent = Math.max(0, Math.min(1, currentEnergy / maxEnergy));
    
    t._network = (t._network || 0) + 0.06;
    t._networkTime = (t._networkTime || 0) + 0.04;
    t._pulse = (t._pulse || 0) + 0.1;
    
    // BODY - Advanced microwave with antenna array (wider design)
    ctx.fillStyle = theme.shell;
    roundedRect(ctx, -26, -20, 52, 40, 6);
    ctx.strokeStyle = '#111'; 
    ctx.lineWidth = 1.5; 
    ctx.strokeRect(-26, -20, 52, 40);

    // Antenna array on top (brightness based on energy)
    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = 0.8 * (0.3 + energyPercent * 0.7); // Dimmer with less energy
    for (let i = 0; i < 7; i++) {
      const x = -21 + i * 7;
      const height = 4 + (i % 3) * 2;
      roundedRect(ctx, x, -20 - height, 2, height, 1);
      
      // Antenna tips with signal indicators
      ctx.fillStyle = theme.electric.replace('0.7', `${0.7 * energyPercent}`);
      ctx.beginPath();
      ctx.arc(x + 1, -20 - height, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = theme.accent;
    }
    ctx.globalAlpha = 1;

    // Network control panel on RIGHT side (enhanced)
    ctx.fillStyle = theme.panel;
    roundedRect(ctx, 16, -18, 8, 36, 2);
    
    // Signal strength indicators (vertical bars) - dimmer with less energy
    ctx.fillStyle = theme.detail;
    for (let i = 0; i < 8; i++) {
      const y = -14 + i * 3.5;
      const height = 1.5 + (i * 0.3);
      roundedRect(ctx, 17, y, 6, height, 0.3);
      
      // Active signal bars based on energy and pulse
      if (energyPercent > 0 && pulseProgress > (i / 8)) {
        ctx.fillStyle = theme.accent;
        ctx.globalAlpha = energyPercent;
        roundedRect(ctx, 17.2, y + 0.1, 5.6, height - 0.2, 0.2);
        ctx.globalAlpha = 1;
        ctx.fillStyle = theme.detail;
      }
    }

    // Large transmission chamber (main microwave area)
    ctx.fillStyle = theme.rim;
    roundedRect(ctx, -24, -16, 38, 32, 5);
    
    // Energy-based interior glow
    this.drawEnergyGlowWindow(ctx, t, theme, energyPercent);
    
    // Network transmission mesh (enhanced microwave door pattern)
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3 * (0.5 + energyPercent * 0.5); // Dimmer with less energy
    for (let x = -20; x < 12; x += 2) {
      ctx.beginPath();
      ctx.moveTo(x, -12);
      ctx.lineTo(x, 12);
      ctx.stroke();
    }
    for (let y = -12; y < 12; y += 2) {
      ctx.beginPath();
      ctx.moveTo(-20, y);
      ctx.lineTo(12, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    
    // Network transmitter core
    this.drawNetworkCore(ctx, t, theme, energyPercent);
    
    // Microwave door handle with network indicators
    ctx.fillStyle = theme.handle;
    roundedRect(ctx, -28, -12, 2, 24, 1);
    
    // Network status LEDs on handle (energy-based)
    ctx.fillStyle = theme.electric;
    for (let i = 0; i < 3; i++) {
      const y = -6 + i * 6;
      const isActive = energyPercent > 0 && pulseProgress > (i / 3);
      ctx.globalAlpha = isActive ? energyPercent : 0.1;
      ctx.beginPath();
      ctx.arc(-27, y, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Stabilizing base with network connections
    ctx.fillStyle = '#000';
    roundedRect(ctx, -22, 18, 10, 2, 1);
    roundedRect(ctx, -6, 18, 10, 2, 1);
    roundedRect(ctx, 10, 18, 10, 2, 1);
    
    // Network field visualization (energy-based)
    this.drawNetworkField(ctx, t, theme.electric, rangeRadius, energyPercent);
  },

  drawEnergyGlowWindow(ctx, t, theme, energyPercent) {
    // Blue energy glow for Network Coverage path
    if (energyPercent > 0) {
      const glowColor = `rgba(0, 120, 255, ${energyPercent * 0.6})`; // Blue theme for network
      const brightGlow = `rgba(0, 160, 255, ${energyPercent * 0.8})`;
      
      // Create interior glow effect
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      
      // Large interior glow fill
      ctx.fillStyle = glowColor;
      roundedRect(ctx, -22, -14, 34, 28, 4);
      
      // Central bright spot for energy concentration
      const centerGlow = ctx.createRadialGradient(-5, 0, 0, -5, 0, 15);
      centerGlow.addColorStop(0, brightGlow);
      centerGlow.addColorStop(1, 'rgba(0, 120, 255, 0)');
      ctx.fillStyle = centerGlow;
      ctx.beginPath();
      ctx.arc(-5, 0, 15, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
    
    // Always draw the dark glass window
    ctx.fillStyle = energyPercent > 0.1 ? 'rgba(0, 0, 0, 0.3)' : theme.glass;
    roundedRect(ctx, -22, -14, 34, 28, 4);
  },

  drawNetworkCore(ctx, t, theme, energyPercent) {
    ctx.save();
    ctx.translate(-5, 2); // Center in microwave chamber
    
    // Central network hub with data streams (brightness based on energy)
    ctx.save();
    ctx.rotate(t._network * 0.5);
    
    // Hub ring with energy-based brightness
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 0.3 + energyPercent * 0.7; // Dimmer with less energy
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner network core
    ctx.fillStyle = theme.accent;
    ctx.globalAlpha = energyPercent; // Fully energy-based visibility
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Data transmission beams (energy-based)
    ctx.strokeStyle = theme.electric;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = energyPercent * 0.8;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + t._network * 0.3;
      const length = 12 + Math.sin(t._networkTime * 3 + i) * 3;
      
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 6, Math.sin(angle) * 6);
      ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
      ctx.stroke();
    }
    
    ctx.restore();
  },

  drawStaticShock(ctx, t) {
    // Static shock - electrical discharge effects
    ctx.save();
    ctx.globalAlpha = 0.4;
    
    // Electric arcs
    ctx.strokeStyle = '#80ffff';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      const startAngle = (i / 4) * Math.PI * 2 + t._pulse;
      const startX = Math.cos(startAngle) * 15;
      const startY = Math.sin(startAngle) * 15;
      
      // Jagged lightning path
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      for (let j = 1; j <= 3; j++) {
        const progress = j / 3;
        const endAngle = startAngle + (Math.PI / 4) * (Math.random() - 0.5);
        const distance = 15 + progress * 10;
        const x = Math.cos(endAngle) * distance + (Math.random() - 0.5) * 4;
        const y = Math.sin(endAngle) * distance + (Math.random() - 0.5) * 4;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    
    ctx.restore();
  },

  drawPulseMicrowave(ctx, t) {
    // Pulse microwave - expanding shockwave rings
    ctx.save();
    
    // Pulse shockwaves
    const pulsePhase = (t._networkTime * 3) % (Math.PI * 2);
    
    for (let i = 0; i < 3; i++) {
      const waveProgress = (pulsePhase + i * Math.PI * 0.66) % (Math.PI * 2);
      const intensity = Math.sin(waveProgress);
      
      if (intensity > 0) {
        ctx.globalAlpha = intensity * 0.4;
        ctx.strokeStyle = '#40ff80';
        ctx.lineWidth = 3 - i;
        
        const radius = 20 + waveProgress * 15;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  },

  drawOrbitalOven(ctx, t) {
    // Orbital oven - satellite and global range effects
    ctx.save();
    
    // Orbital satellites
    for (let i = 0; i < 3; i++) {
      const orbitAngle = t._network * (0.5 + i * 0.3) + i * Math.PI * 0.66;
      const orbitRadius = 35 + i * 8;
      const satX = Math.cos(orbitAngle) * orbitRadius;
      const satY = Math.sin(orbitAngle) * orbitRadius;
      
      // Satellite body
      ctx.fillStyle = '#00ffff';
      ctx.globalAlpha = 0.7;
      roundedRect(ctx, satX - 2, satY - 2, 4, 4, 1);
      
      // Satellite beam to center
      ctx.strokeStyle = '#40ffff';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.moveTo(satX, satY);
      ctx.lineTo(0, 0);
      ctx.stroke();
    }
    
    // Global coverage indicator
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = '#00ccff';
    ctx.lineWidth = 2;
    for (let radius = 50; radius <= 150; radius += 25) {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.restore();
  },

  drawNetworkField(ctx, t, color, maxRange, energyPercent) {
    // Network field rings expand outward (energy-based visibility)
    if (energyPercent === 0) return; // No field when no energy
    
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = energyPercent * 0.3; // Dimmer with less energy
    
    const pulsePhase = (t._networkTime || 0) * 1.5;
    
    for (let i = 0; i < 4; i++) {
      const radius = (40 + i * 25) + Math.sin(pulsePhase + i) * 8;
      if (radius < maxRange) {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }
};

// Export the render function
export function renderNetwork_coverageVisuals(ctx, tower, state) {
  const tierLevel = tower.tier || 3; // Default to tier 3 if not specified
  
  if (tierLevel >= 5 && NetworkCoverageVisuals.tier5) {
    NetworkCoverageVisuals.tier5(ctx, tower, state);
  } else if (tierLevel >= 4 && NetworkCoverageVisuals.tier4) {
    NetworkCoverageVisuals.tier4(ctx, tower, state);
  } else if (tierLevel >= 3 && NetworkCoverageVisuals.tier3) {
    NetworkCoverageVisuals.tier3(ctx, tower, state);
  }
}
