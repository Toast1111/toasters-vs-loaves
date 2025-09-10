// @ts-nocheck
import { RARITY } from './shared';
import { roundedRect } from '../drawUtils';

const airfryer = {
  key:'airfryer', name:'Air Fryer', cost:340, rarity:RARITY.EPIC,
  desc:'Rapid-fire hot air blasts. Lower damage but extreme speed.',
  base:{range:140, fireRate:3.5, damage:8, projectileSpeed:450},
  upgradePaths:[
    { // Path 0: Pressure Cooker
      name: 'Pressure Systems',
      upgrades:[
        {name:'Precision Jets', cost:140, tip:'+6 damage, slightly slower but more focused', 
         effect:t=>{t.damage+=6; t.fireRate-=0.3; t.pressureCooker=true;}},
        {name:'Pressurized Chamber', cost:230, tip:'+10 damage, chance to crit, steam effects', 
         effect:t=>{t.damage+=10; t.fireRate-=0.2; t.critChance=0.15; t.critMultiplier=2.0; t.steamEffects=true;}},
        {name:'Superheated Pressure', cost:400, tip:'+16 damage, short-range explosive projectiles', 
         effect:t=>{t.damage+=16; t.fireRate-=0.5; t.critChance=0.25; t.critMultiplier=2.5; t.explosiveProjectiles=true; t.projectileLifetime=0.3;}},
        {name:'Pressure Burst', cost:680, tip:'+25 damage, radial explosion on impact', 
         effect:t=>{t.damage+=25; t.fireRate-=0.3; t.critChance=0.4; t.critMultiplier=3.0; t.radialExplosion=true; t.explosionRadius=60;}},
        {name:'Pressure Bomb', cost:1150, tip:'Massive close-range area damage, continuous pressure bursts', 
         effect:t=>{t.damage+=50; t.fireRate-=0.2; t.critChance=0.8; t.critMultiplier=4.0; t.continuousBursts=true; t.explosionRadius=100; t.projectileLifetime=0.2;}}
      ]
    },
    { // Path 1: Extended Operations
      name: 'Extended Range',
      upgrades:[
        {name:'Extended Basket', cost:180, tip:'+45 range', 
         effect:t=>t.range+=45},
        {name:'Circulation Fan', cost:290, tip:'+70 range, pulls in projectiles', 
         effect:t=>{t.range+=70; t.projectileAttraction=true;}},
        {name:'Atmospheric Control', cost:500, tip:'+110 range, creates wind currents', 
         effect:t=>{t.range+=110; t.windCurrents=true; t.redirectsProjectiles=true;}},
        {name:'Weather Station', cost:820, tip:'+180 range, controls battlefield weather', 
         effect:t=>{t.range+=180; t.weatherControl=true; t.globalWindEffects=true;}},
        {name:'Climate Controller', cost:1400, tip:'Map-wide effects, ultimate weather control', 
         effect:t=>{t.range=9999; t.climateControl=true; t.globalTemperatureControl=true; t.weatherDomination=true;}}
      ]
    },
    { // Path 2: Cyclone Mode
      name: 'Cyclone Generation',
      upgrades:[
        {name:'Cyclone Mode', cost:160, tip:'+1.2 fire rate', 
         effect:t=>t.fireRate+=1.2},
        {name:'Twin Cyclones', cost:280, tip:'+1.8 fire rate, shoots 2 projectiles', 
         effect:t=>{t.fireRate+=1.8; t.multiShot=2;}},
        {name:'Tornado Generator', cost:480, tip:'+2.5 fire rate, shoots 3 projectiles -> REPLACES normal attack with charge-up system', 
         effect:t=>{t.fireRate+=2.5; t.multiShot=3; t.tornadoEffect=true; 
           // Charge Shot mode config (replaces normal rapid-fire with charge-up system)
           t.chargeShot=true; t.chargeTime=2.0; t.gatlingDuration=1.0; t.gatlingRate=20; t.coneRadians=0.9; 
           t._charge=0; t._gatlingTime=0; t._gatlingCooldown=0;}},
        {name:'Hurricane Engine', cost:800, tip:'+3.5 fire rate, creates hurricane zones', 
         effect:t=>{t.fireRate+=3.5; t.multiShot=5; t.hurricaneZones=true; t.persistentTornados=true;}},
        {name:'Atmospheric Devastator', cost:1350, tip:'Ultimate speed, reality-bending winds', 
         effect:t=>{t.fireRate+=6.0; t.multiShot=8; t.realityBendingWinds=true; t.dimensionalVortex=true;}}
      ]
    }
  ],
  draw(ctx, t, state){
    // Theme colors (matching the SVG design)
    const shell = '#2b2f3c', plate = '#343a4e', panel = '#b8aed4', doorFace = '#30354b';
    const knobFace = '#ececf5', knobSlot = '#8d93a6', led = '#6a5aed', feet = '#0c101c';
    const stroke = '#1e2335', highlight = 'rgba(255,255,255,0.18)';
    
    // Colors for advanced visuals
    const glass = '#141a2b', rim = '#3a3550', accent = '#6a5aed', detail = '#0b0f18', handle = '#cfc7e6', mute = '#12162a';

    // Init animation state
    const chargeProg = Math.min(1, ((t._charge||0) / (t.chargeTime||2)) || 0);
    const isBarraging = (t._gatlingTime||0) > 0;
    
    // Spinning speed based on charge state
    let spinDelta;
    if (t.chargeShot) {
      // Charge shot mode: very slow -> fast charging -> super fast barrage -> back to slow
      if (isBarraging) {
        spinDelta = 0.8; // Super fast during barrage
      } else {
        spinDelta = 0.02 + chargeProg * 0.4; // Slow to fast based on charge
      }
    } else {
      // Normal mode: no spinning
      spinDelta = 0;
    }
    
    t._ring = (t._ring || 0) + spinDelta; // spin ring reflects charge state
    
    // Steam and hinge animations based on upgrade paths
    let isPressureCooker = t.pressureCooker || t.steamEffects;
    if (t.chargeShot) {
      t._steam = (t._steam || 0) + 0.03; // steam phase for cyclone path
    } else if (isPressureCooker) {
      t._steam = (t._steam || 0) + 0.05; // faster steam for pressure cooker
    }
    
    // Hinge movement based on upgrade path
    let hinge = 0; // Default: no movement
    if (t.chargeShot) {
      // Cyclone path: breathing based on tempo
      const baseHinge = 0.05; // radians
      const tempo = Math.min(3, Math.max(1, t.fireRate / 2));
      hinge = baseHinge + Math.sin(t._ring * tempo) * 0.06;
    } else if (isPressureCooker && t.steamEffects) {
      // Pressure cooker: more pronounced, pressure-release movement
      hinge = 0.1 + Math.sin((t._steam || 0) * 2) * 0.15;
    }

    // Check if we should use advanced visuals (tier 3+ on any path)
    const useAdvancedVisuals = (t.upgradeTiers && (t.upgradeTiers[0] >= 3 || t.upgradeTiers[1] >= 3 || t.upgradeTiers[2] >= 3));
    
    if (!useAdvancedVisuals) {
      // BASE AIR FRYER DESIGN (Tiers 0-2) - Based on provided SVG
      
      // Main body (scaled down to fit our 36x48 space)
      ctx.fillStyle = shell;
      roundedRect(ctx, -18, -24, 36, 44, 6);
      
      // Outline
      ctx.strokeStyle = stroke; 
      ctx.lineWidth = 1;
      ctx.strokeRect(-18, -24, 36, 44);
      
      // Side highlights
      ctx.fillStyle = highlight;
      roundedRect(ctx, -16, -22, 2, 40, 2);
      roundedRect(ctx, 14, -22, 2, 40, 2);
      
      // Top plate
      ctx.fillStyle = plate;
      roundedRect(ctx, -15, -22, 30, 8, 3);
      
      // Simple vents on top plate
      ctx.fillStyle = '#121726';
      for (let i = 0; i < 6; i++) {
        const x = -12 + i * 4;
        roundedRect(ctx, x, -20, 2.5, 1.5, 0.8);
      }
      
      // Control panel strip
      ctx.fillStyle = panel;
      roundedRect(ctx, -14, -8, 28, 6, 2);
      
      // LED indicator
      ctx.fillStyle = led;
      ctx.beginPath();
      ctx.arc(-10, -5, 1, 0, Math.PI * 2);
      ctx.fill();
      
      // Simple knob
      ctx.fillStyle = knobFace;
      roundedRect(ctx, 8, -7, 4, 4, 2);
      ctx.fillStyle = knobSlot;
      roundedRect(ctx, 9.2, -6, 1.6, 2, 0.8);
      
      // Door/face (flat plate)
      ctx.fillStyle = doorFace;
      roundedRect(ctx, -16, 0, 32, 18, 3);
      
      // Handle
      ctx.fillStyle = '#cfc7e6';
      roundedRect(ctx, -5, 16, 10, 4, 2);
      
      // Feet
      ctx.fillStyle = feet;
      roundedRect(ctx, -14, 18, 5, 2, 1);
      roundedRect(ctx, 9, 18, 5, 2, 1);
      
    } else {
      // ADVANCED VISUALS (Tier 3+) - Path-specific transformations
      
      if (isPressureCooker) {
        // PRESSURE COOKER TRANSFORMATION
        // Taller, more cylindrical shape
        ctx.fillStyle = shell; 
        roundedRect(ctx, -16, -28, 32, 56, 8);
        ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; 
        ctx.strokeRect(-16, -28, 32, 56);
        
        // Pressure reinforcement bands
        if (t.steamEffects) {
          ctx.fillStyle = '#1a1e2a'; 
          roundedRect(ctx, -17, -20, 34, 3, 1.5);
          roundedRect(ctx, -17, -5, 34, 3, 1.5);
          roundedRect(ctx, -17, 10, 34, 3, 1.5);
        }
        
        // Side highlights
        ctx.globalAlpha = 0.18; ctx.fillStyle = '#ffffff';
        roundedRect(ctx, -15, -24, 4, 48, 6);
        roundedRect(ctx, 11, -24, 4, 48, 6);
        ctx.globalAlpha = 1;
        
        // Pressure cooker top with release valve
        ctx.fillStyle = plate; roundedRect(ctx, -14, -26, 28, 8, 4);
        
        // Pressure release valve on top
        if (t.steamEffects) {
          ctx.fillStyle = '#2a2f42'; 
          roundedRect(ctx, -3, -30, 6, 8, 3);
          ctx.fillStyle = '#1a1e2a';
          roundedRect(ctx, -1, -32, 2, 4, 1);
        }
        
        // Pressure gauge
        if (t.pressureCooker) {
          ctx.fillStyle = knobFace;
          ctx.beginPath(); ctx.arc(12, -22, 4, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = knobSlot;
          ctx.beginPath(); ctx.arc(12, -22, 2, 0, Math.PI * 2); ctx.fill();
        }
        
        // Control panel
        ctx.fillStyle = panel; roundedRect(ctx, -14, -8, 28, 6, 2);
        
        // Door
        ctx.fillStyle = doorFace; roundedRect(ctx, -14, 0, 28, 18, 3);
        
        // Handle
        ctx.fillStyle = handle; roundedRect(ctx, -5, 16, 10, 4, 2);
        
        // Feet
        ctx.fillStyle = feet;
        roundedRect(ctx, -12, 20, 10, 3, 1.5); 
        roundedRect(ctx, 2, 20, 10, 3, 1.5);
        
      } else {
        // STANDARD ADVANCED AIR FRYER (for other paths)
        ctx.fillStyle = shell; roundedRect(ctx, -18, -24, 36, 48, 9);
        ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.strokeRect(-18, -24, 36, 48);
        
        // Side highlights
        ctx.globalAlpha = 0.18; ctx.fillStyle = '#ffffff';
        roundedRect(ctx, -17, -20, 4, 40, 6);
        roundedRect(ctx, 13, -20, 4, 40, 6);
        ctx.globalAlpha = 1;
        
        // Top plate with vents
        ctx.fillStyle = plate; roundedRect(ctx, -16, -22, 32, 10, 4);
        ctx.fillStyle = mute; 
        const vx0 = -16; const vy = -18; const vw = 4.2; const vh = 2.4; const gap = 2.2;
        for (let i = 0; i < 8; i++) { roundedRect(ctx, vx0 + i * (vw + gap), vy, vw, vh, 1.2); }
        
        // Control panel
        ctx.fillStyle = panel; roundedRect(ctx, -16, -8, 32, 8, 4);
        ctx.fillStyle = detail; roundedRect(ctx, -6, -7, 12, 6, 3);
        ctx.fillStyle = knobFace;
        roundedRect(ctx, -14, -7, 5, 5, 2.5); roundedRect(ctx, 9, -7, 5, 5, 2.5);
        ctx.fillStyle = knobSlot;
        roundedRect(ctx, -12.5, -6, 2, 3.6, 1.8); roundedRect(ctx, 10.5, -6, 2, 3.6, 1.8);
        
        // Window rim
        ctx.fillStyle = rim; roundedRect(ctx, -16, 0, 32, 16, 5);
        
        // Basket (hinged)
        ctx.save();
        ctx.translate(0, 8);
        ctx.rotate(hinge);
        ctx.fillStyle = glass; roundedRect(ctx, -14, -6, 28, 12, 3.5);
        
        // Circulation ring for cyclone path
        if (t.chargeShot) {
          ctx.save();
          ctx.translate(0, 3);
          ctx.rotate(t._ring);
          ctx.strokeStyle = accent; ctx.lineWidth = 1.8;
          ctx.setLineDash([7, 6]);
          ctx.beginPath(); ctx.arc(0, 0, 9.5, 0, Math.PI * 2); ctx.stroke();
          ctx.setLineDash([]);
          
          // Progress arc
          if ((t._gatlingTime||0) <= 0) {
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
              ctx.arc(0, 0, 11.5, -Math.PI/2, -Math.PI/2 + prog * Math.PI * 2);
              ctx.stroke();
            }
          }
          
          // Barrage indicator
          if ((t._gatlingTime||0) > 0) {
            ctx.strokeStyle = '#ff6666'; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.stroke();
          }
          ctx.restore();
        }
        
        // Handle
        ctx.fillStyle = handle; roundedRect(ctx, -10, 7, 20, 6, 3);
        ctx.restore();
        
        // Feet
        ctx.fillStyle = feet; 
        roundedRect(ctx, -12, 20, 10, 3, 1.5); 
        roundedRect(ctx, 2, 20, 10, 3, 1.5);
      }
      
      // STEAM EFFECTS (for advanced tiers)
      if (t.chargeShot || (isPressureCooker && t.steamEffects)) {
        const steamColor = isPressureCooker ? 'rgba(255,255,255,0.8)' : 'rgba(191,198,255,0.7)';
        const steamIntensity = isPressureCooker ? 1.5 : 1.0;
        
        const rise = (offset, phaseScale, x0) => {
          ctx.save();
          ctx.translate(0, isPressureCooker ? -26 : -22);
          ctx.globalAlpha = 0.7 * steamIntensity;
          ctx.strokeStyle = steamColor; ctx.lineWidth = isPressureCooker ? 1.8 : 1.2;
          const tphase = (t._steam || 0) * phaseScale + offset;
          const yoff = -10 - (Math.sin(tphase) + 1) * 3 * steamIntensity;
          ctx.beginPath();
          ctx.moveTo(x0, 0);
          ctx.quadraticCurveTo(x0 + 3, -6, x0, -12 + yoff);
          ctx.quadraticCurveTo(x0 - 4, -20 + yoff, x0, -30 + yoff * 1.3);
          ctx.stroke();
          ctx.restore();
        };
        
        if (isPressureCooker) {
          rise(0.0, 1.5, 0); // Central steam jet
          if (t.explosiveProjectiles) {
            rise(-0.3, 1.2, -8);
            rise(0.3, 1.2, 8);
          }
        } else {
          rise(-0.2, 1.0, -8);
          rise(0.0, 1.1, 0);
          rise(0.3, 1.2, 8);
        }
      }
    }
  }
};

export default airfryer;
