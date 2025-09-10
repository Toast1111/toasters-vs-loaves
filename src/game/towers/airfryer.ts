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
        {name:'Precision Jets', cost:140, tip:'+6 damage', 
         effect:t=>t.damage+=6},
        {name:'Pressurized Chamber', cost:230, tip:'+10 damage, chance to crit', 
         effect:t=>{t.damage+=10; t.critChance=0.15; t.critMultiplier=2.0;}},
        {name:'Superheated Air', cost:400, tip:'+16 damage, higher crit chance', 
         effect:t=>{t.damage+=16; t.critChance=0.25; t.critMultiplier=2.5; t.superheated=true;}},
        {name:'Plasma Vortex', cost:680, tip:'+25 damage, crits cause explosions', 
         effect:t=>{t.damage+=25; t.critChance=0.4; t.critMultiplier=3.0; t.critExplosions=true;}},
        {name:'Miniature Sun', cost:1150, tip:'Extreme damage, constant crits, area effect', 
         effect:t=>{t.damage+=50; t.critChance=0.8; t.critMultiplier=4.0; t.solarFlares=true; t.constantHeat=true;}}
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
    // Theme colors (inspired by provided SVG)
    const shell = '#2b2f3c', panel = '#b9acd2', glass = '#141a2b', rim = '#3a3550';
    const accent = '#6a5aed', detail = '#0b0f18', handle = '#cfc7e6', mute = '#12162a';

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
    // Normal mode: medium constant speed
    spinDelta = 0.15;
  }
  
  t._ring = (t._ring || 0) + spinDelta; // spin ring reflects charge state
  t._steam = (t._steam || 0) + 0.03; // steam phase
    // Slight breathing hinge based on firing tempo
    const baseHinge = 0.05; // radians
    const tempo = Math.min(3, Math.max(1, t.fireRate / 2));
    const hinge = baseHinge + Math.sin(t._ring * tempo) * 0.06;

    // BODY (rounded shell)
    ctx.fillStyle = shell; roundedRect(ctx, -18, -24, 36, 48, 9);
    // Outline
    ctx.strokeStyle = '#1e2335'; ctx.lineWidth = 1.5; ctx.strokeRect(-18, -24, 36, 48);

    // Side highlights
    ctx.globalAlpha = 0.18; ctx.fillStyle = '#ffffff';
    roundedRect(ctx, -17, -20, 4, 40, 6);
    roundedRect(ctx, 13, -20, 4, 40, 6);
    ctx.globalAlpha = 1;

    // TOP PLATE
    ctx.fillStyle = '#343a4e'; roundedRect(ctx, -16, -22, 32, 10, 4);
    // Vents
    ctx.fillStyle = mute; const vx0 = -16; const vy = -18; const vw = 4.2; const vh = 2.4; const gap = 2.2;
    for (let i = 0; i < 8; i++) { roundedRect(ctx, vx0 + i * (vw + gap), vy, vw, vh, 1.2); }

    // CONTROL PANEL band
    ctx.fillStyle = panel; roundedRect(ctx, -16, -8, 32, 8, 4);
    // Small display + knobs
    ctx.fillStyle = detail; roundedRect(ctx, -6, -7, 12, 6, 3);
    ctx.fillStyle = '#ececf5';
    roundedRect(ctx, -14, -7, 5, 5, 2.5); roundedRect(ctx, 9, -7, 5, 5, 2.5);
    ctx.fillStyle = '#8d93a6';
    roundedRect(ctx, -12.5, -6, 2, 3.6, 1.8); roundedRect(ctx, 10.5, -6, 2, 3.6, 1.8);

    // WINDOW RIM
    ctx.fillStyle = rim; roundedRect(ctx, -16, 0, 32, 16, 5);

    // BASKET (hinged from bottom of window)
    ctx.save();
    ctx.translate(0, 8); // bottom edge of window
    ctx.rotate(hinge);
    // Basket glass
    ctx.fillStyle = glass; roundedRect(ctx, -14, -6, 28, 12, 3.5);
    // Circulation ring (spins) + progress arc - only show if charge shot is unlocked
    if (t.chargeShot) {
      ctx.save();
      ctx.translate(0, 3);
      ctx.rotate(t._ring);
      ctx.strokeStyle = accent; ctx.lineWidth = 1.8;
      ctx.setLineDash([7, 6]);
      ctx.beginPath(); ctx.arc(0, 0, 9.5, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      
      // Progress arc shows charging status
      if ((t._gatlingTime||0) <= 0) {
        const prog = Math.min(1, ((t._charge||0) / (t.chargeTime||2)) || 0);
        if (prog > 0) {
          // Color changes as it charges: blue -> yellow -> red
          let progressColor;
          if (prog < 0.5) {
            progressColor = `rgb(${Math.floor(154 + prog * 200)}, ${Math.floor(168 + prog * 174)}, 255)`;
          } else {
            const redProg = (prog - 0.5) * 2;
            progressColor = `rgb(255, ${Math.floor(255 - redProg * 100)}, ${Math.floor(255 - redProg * 255)})`;
          }
          ctx.strokeStyle = progressColor; 
          ctx.lineWidth = 3.0; // Thicker for visibility
          ctx.beginPath(); 
          ctx.arc(0, 0, 11.5, -Math.PI/2, -Math.PI/2 + prog * Math.PI * 2);
          ctx.stroke();
        }
      }
      
      // During barrage, show spinning indicator
      if ((t._gatlingTime||0) > 0) {
        ctx.strokeStyle = '#ff6666'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore();
    }
    // Handle
    ctx.fillStyle = handle; roundedRect(ctx, -10, 7, 20, 6, 3);
    ctx.restore();

    // FEET
    ctx.fillStyle = '#0c101c'; roundedRect(ctx, -12, 20, 10, 3, 1.5); roundedRect(ctx, 2, 20, 10, 3, 1.5);

    // STEAM wisps (three paths rising from top plate)
    const steamColor = 'rgba(191,198,255,0.7)';
    const rise = (offset, phaseScale, x0) => {
      ctx.save();
      ctx.translate(0, -22);
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = steamColor; ctx.lineWidth = 1.2;
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

export default airfryer;
