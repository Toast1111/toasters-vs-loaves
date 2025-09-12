// @ts-nocheck
import { roundedRect } from '../../../drawUtils';

// General visual system for airfryer tiers 1-2 (all paths)
// Based on HTML prototype: Simple, basic airfryer design before paths diverge
export const GeneralAirfryerVisuals = {
  
  // Base visual (no upgrades) - matching HTML basic design
  base(ctx, t, state) {
    // Default theme matching HTML CSS variables
    const theme = {
      shell: '#2b2f3c',    // --shell
      plate: '#343a4e',    // --plate  
      panel: '#b8aed4',    // --panel (simplified control strip)
      led: '#6a5aed',      // --led
      knobFace: '#ececf5', // --knob-face
      knobSlot: '#8d93a6', // --knob-slot
      feet: '#0c101c',     // --feet
      stroke: '#1e2335',   // --stroke
      door: '#30354b',     // simple door face
      handle: '#cfc7e6'    // handle color
    };
    
    GeneralAirfryerVisuals.drawHTMLBasicAirfryer(ctx, t, theme);
  },

  // Path 0 Tier 1-2: Early pressure upgrades - slightly enhanced basic design
  path0_tier12(ctx, t, state) {
    const theme = {
      shell: '#3c2b2b',    // warmer shell for pressure
      plate: '#4e3a34', 
      panel: '#d4aeb8',    // warmer panel
      led: '#ed5a6a',      // red LED for pressure
      knobFace: '#f5ecec',
      knobSlot: '#a68d8d',
      feet: '#1c0c0c',
      stroke: '#352b1e',
      door: '#4b3035',
      handle: '#e6c7cf'
    };
    
    GeneralAirfryerVisuals.drawHTMLBasicAirfryer(ctx, t, theme);
    GeneralAirfryerVisuals.drawPressureEnhancements(ctx, t, theme);
  },

  // Path 1 Tier 1-2: Early range upgrades - cooler tones
  path1_tier12(ctx, t, state) {
    const theme = {
      shell: '#2b3c3c',    // cooler shell for range
      plate: '#343a4e', 
      panel: '#aed4d4',    // cooler panel
      led: '#5aaced',      // blue LED for range
      knobFace: '#ecf5f5',
      knobSlot: '#8da6a6',
      feet: '#0c1c1c',
      stroke: '#1e3535',
      door: '#303b4b',
      handle: '#c7e6e6'
    };
    
    GeneralAirfryerVisuals.drawHTMLBasicAirfryer(ctx, t, theme);
    GeneralAirfryerVisuals.drawRangeEnhancements(ctx, t, theme);
  },

  // Path 2 Tier 1-2: Early cyclone upgrades - electric green theme
  path2_tier12(ctx, t, state) {
    const theme = {
      shell: '#2b3c2b',    // greener shell for cyclone
      plate: '#3a4e34', 
      panel: '#aed4b8',    // greener panel
      led: '#6aed5a',      // green LED for cyclone
      knobFace: '#ecf5ec',
      knobSlot: '#8da68d',
      feet: '#0c1c0c',
      stroke: '#1e351e',
      door: '#303b35',
      handle: '#c7e6cf'
    };
    
    GeneralAirfryerVisuals.drawHTMLBasicAirfryer(ctx, t, theme);
    GeneralAirfryerVisuals.drawCycloneEnhancements(ctx, t, theme);
  },

  // Base airfryer structure matching HTML prototype exactly
  drawHTMLBasicAirfryer(ctx, t, theme) {
    // Animation state
    t._ring = (t._ring || 0) + 0.02; // Slow, steady rotation for basic model
    
    // BODY (main shell) - matching HTML viewBox scale and proportions
    ctx.fillStyle = theme.shell;
    roundedRect(ctx, -24, -30, 48, 52, 6.5); // Scaled from HTML 240x260 with rx=26
    
    // Stroke outline
    ctx.strokeStyle = theme.stroke;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-23.6, -29.6, 47.2, 51.2);
    
    // Side highlights (matching HTML .sideHi)
    ctx.globalAlpha = 0.18; // matching HTML rgba(255,255,255,.18)
    ctx.fillStyle = '#ffffff';
    roundedRect(ctx, -22, -27.6, 2, 47.2, 1.6); // Left highlight
    roundedRect(ctx, 20, -27.6, 2, 47.2, 1.6);   // Right highlight
    ctx.globalAlpha = 1;

    // TOP PLATE + VENTS (matching HTML #topPlate)
    ctx.fillStyle = theme.plate;
    roundedRect(ctx, -20, -25.6, 40, 10, 2.8); // Scaled from HTML 200x50 rx=14
    
    // Vents pattern (matching HTML vent layout)
    ctx.fillStyle = '#121726';
    const ventPositions = [-15.6, -11.6, -7.6, -3.6, 0.4, 4.4, 8.4, 12.4]; // Scaled positions
    ventPositions.forEach(x => {
      roundedRect(ctx, x, -21.6, 2.8, 1.2, 0.6); // Scaled vent size
    });

    // SIMPLE CONTROL STRIP (matching HTML #panel)
    ctx.fillStyle = theme.panel;
    roundedRect(ctx, -19.2, -13.2, 38.4, 8.8, 2.4); // Scaled from HTML 192x44 rx=12
    
    // LED indicator (matching HTML #led)
    ctx.fillStyle = theme.led;
    ctx.beginPath();
    ctx.arc(-14, -8.8, 0.9, 0, Math.PI * 2); // Scaled from HTML r=4.5
    ctx.fill();
    
    // Single knob (matching HTML #knob)
    ctx.fillStyle = theme.knobFace;
    roundedRect(ctx, 10.4, -11.6, 6, 6, 3); // Scaled from HTML 30x30 rx=15
    ctx.fillStyle = theme.knobSlot;
    roundedRect(ctx, 12.6, -10, 1.2, 2.8, 0.6); // Scaled knob indicator

    // DOOR/FACE (flat plate, no window - matching HTML #door)
    ctx.fillStyle = theme.door;
    roundedRect(ctx, -22, -2, 44, 23.2, 3.2); // Scaled from HTML 220x116 rx=16

    // HANDLE (matching HTML #handle)
    ctx.fillStyle = theme.handle;
    roundedRect(ctx, -6.8, 18.4, 13.6, 5.2, 1.8); // Scaled from HTML 68x26 rx=9

    // FEET (matching HTML feet)
    ctx.fillStyle = theme.feet;
    roundedRect(ctx, -18.4, 19.2, 7.2, 2, 1); // Left foot, scaled from HTML 36x10 rx=5
    roundedRect(ctx, 11.2, 19.2, 7.2, 2, 1);  // Right foot
  },

  // Subtle pressure enhancements for path 0 tiers 1-2
  drawPressureEnhancements(ctx, t, theme) {
    // Simple pressure indicator pulses
    ctx.save();
    ctx.globalAlpha = 0.3 + Math.sin(t._ring * 2) * 0.2;
    ctx.strokeStyle = theme.led;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(-14, -8.8, 2, 0, Math.PI * 2); // Pulse around LED
    ctx.stroke();
    ctx.restore();
  },

  // Subtle range enhancements for path 1 tiers 1-2  
  drawRangeEnhancements(ctx, t, theme) {
    // Simple range field visualization
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = theme.led;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.arc(0, 5, 25, 0, Math.PI * 2); // Detection range circle
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  },

  // Subtle cyclone enhancements for path 2 tiers 1-2
  drawCycloneEnhancements(ctx, t, theme) {
    // Simple air circulation visualization
    ctx.save();
    ctx.translate(0, 5);
    ctx.rotate(t._ring);
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = theme.led;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 1.5); // 3/4 circle circulation
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
};