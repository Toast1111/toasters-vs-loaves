// @ts-nocheck
import { RARITY } from '../shared';
import { drawDefaultToaster } from '../../../../rendering/drawUtils';

const wide = {
  key:'wide', name:'Missile Launcher', cost:180, rarity:RARITY.RARE,
  desc:'Submarine-style vertical launch system. Slow but devastating indirect fire.',
  base:{range:220, fireRate:0.25, damage:55, projectileSpeed:180, splash:40, splashDmg:25, 
        missileSlots:1, slotCooldowns:[0], arcingFire:true, indirectFire:true},
  upgradePaths:[
    { // Path 0: Launcher Array (Slot Expansion)
      name: 'Launcher Array',
      upgrades:[
        {name:'Dual Launch', cost:120, tip:'Adds 2nd missile slot (+50% potential DPS)', 
         effect:t=>{
           t.missileSlots=2; 
           t.slotCooldowns=[0,0];
           if(t.slotAmmoTypes) t.slotAmmoTypes = ['standard', 'standard'];
         }},
        {name:'Triple Threat', cost:240, tip:'Adds 3rd missile slot, faster reload', 
         effect:t=>{
           t.missileSlots=3; 
           t.slotCooldowns=[0,0,0]; 
           t.fireRate+=0.05;
           if(t.slotAmmoTypes) t.slotAmmoTypes = ['standard', 'standard', 'standard'];
         }},
        {name:'Quad Battery', cost:420, tip:'Full 4-slot array, synchronized targeting', 
         effect:t=>{
           t.missileSlots=4; 
           t.slotCooldowns=[0,0,0,0]; 
           t.fireRate+=0.1; 
           t.syncTargeting=true;
           if(t.slotAmmoTypes) t.slotAmmoTypes = ['standard', 'standard', 'standard', 'standard'];
         }},
        {name:'Rapid Deploy', cost:700, tip:'All slots reload 40% faster', 
         effect:t=>{t.fireRate+=0.15; t.rapidDeploy=true;}},
        {name:'Arsenal Ship', cost:1200, tip:'6 missile slots, continuous barrage capability', 
         effect:t=>{
           t.missileSlots=6; 
           t.slotCooldowns=[0,0,0,0,0,0]; 
           t.fireRate+=0.25; 
           t.continuousBarrage=true;
           if(t.slotAmmoTypes) t.slotAmmoTypes = new Array(6).fill('standard');
         }}
      ]
    },
    { // Path 1: Warhead Technology  
      name: 'Warhead Tech',
      upgrades:[
        {name:'High Explosive', cost:100, tip:'+25 damage, +20 splash damage', 
         effect:t=>{t.damage+=25; t.splashDmg+=20; t.splash+=10;}},
        {name:'Shaped Charge', cost:200, tip:'+35 damage, armor piercing', 
         effect:t=>{t.damage+=35; t.armorPiercing=3; t.penetratesShields=true;}},
        {name:'Cluster Warhead', cost:380, tip:'+40 damage, submunitions on impact', 
         effect:t=>{t.damage+=40; t.clusterBombs=true; t.submunitions=3; t.submunitionDamage=20;}},
        {name:'Thermobaric', cost:650, tip:'+60 damage, massive splash, DoT fire', 
         effect:t=>{t.damage+=60; t.splash+=30; t.splashDmg+=35; t.fireDamage=15; t.burnDuration=3;}},
        {name:'Multi-Warhead', cost:1100, tip:'Choose ammo type per slot, exotic payloads', 
         effect:t=>{
           t.multiWarhead=true; 
           t.customAmmoPerSlot=true; 
           t.exoticPayloads=true; 
           t.damage+=80;
           // Initialize slot ammo types with defaults
           if(!t.slotAmmoTypes) {
             t.slotAmmoTypes = new Array(t.missileSlots || 1).fill('standard');
           }
         }}
      ]
    },
    { // Path 2: Fire Control Systems
      name: 'Fire Control',
      upgrades:[
        {name:'Targeting Computer', cost:90, tip:'+60 range, improved accuracy', 
         effect:t=>{t.range+=60; t.accuracy=1.2; t.targetingComputer=true;}},
        {name:'Radar Array', cost:180, tip:'+80 range, detects cloaked, lead targeting', 
         effect:t=>{t.range+=80; t.detectsCloaked=true; t.leadTargeting=true; t.radarArray=true;}},
        {name:'Satellite Link', cost:320, tip:'+120 range, global intelligence network', 
         effect:t=>{t.range+=120; t.satelliteLink=true; t.globalIntel=true; t.perfectTracking=true;}},
        {name:'Aegis System', cost:580, tip:'+150 range, intercepts enemy projectiles', 
         effect:t=>{t.range+=150; t.aegisSystem=true; t.interceptsProjectiles=true; t.defensiveMatrix=true;}},
        {name:'Orbital Strike', cost:1000, tip:'Map-wide range, precision orbital bombardment', 
         effect:t=>{t.range=9999; t.orbitalStrike=true; t.mapWideRange=true; t.precisionStrike=true; t.damage+=100;}}
      ]
    }
  ],
  draw(ctx, t){ 
    drawMissileLauncher(ctx, t);
  }
};

// Custom missile launcher visual
function drawMissileLauncher(ctx, t) {
  // Base platform (submarine-style)
  ctx.fillStyle = '#2a3544';
  ctx.strokeStyle = '#1a2332';
  ctx.lineWidth = 2;
  
  // Main body (cylindrical submarine shape)
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  // Conning tower
  ctx.fillStyle = '#344155';
  ctx.fillRect(-6, -16, 12, 8);
  ctx.strokeRect(-6, -16, 12, 8);
  
  // Missile launch tubes based on upgrade level
  const slots = t.missileSlots || 1;
  ctx.fillStyle = '#1a1a1a';
  
  for(let i = 0; i < Math.min(slots, 6); i++) {
    const angle = (i * Math.PI * 2 / Math.max(slots, 4)) - Math.PI/2;
    const radius = slots > 4 ? 8 : 6;
    const tubeX = Math.cos(angle) * radius;
    const tubeY = Math.sin(angle) * radius;
    
    // Missile tube
    ctx.beginPath();
    ctx.arc(tubeX, tubeY, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Slot ready indicator
    if(t.slotCooldowns && t.slotCooldowns[i] === 0) {
      ctx.fillStyle = '#00ff44';
      ctx.beginPath();
      ctx.arc(tubeX, tubeY, 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#ff4400';
      ctx.beginPath();
      ctx.arc(tubeX, tubeY, 1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#1a1a1a';
  }
  
  // Radar/targeting system
  ctx.strokeStyle = '#666666';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-3, -16);
  ctx.lineTo(0, -20);
  ctx.lineTo(3, -16);
  ctx.stroke();
  
  // Upgrade visual effects
  if(t.multiWarhead) {
    // Nuclear/exotic glow for T5 warhead upgrade
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 1;
    ctx.strokeRect(-6, -16, 12, 8);
    ctx.shadowBlur = 0;
  } else if(t.thermobaric) {
    // Fire glow for thermobaric
    ctx.shadowColor = '#ff4400';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#ff4400';
    ctx.lineWidth = 1;
    ctx.strokeRect(-6, -16, 12, 8);
    ctx.shadowBlur = 0;
  }
  
  if(t.orbitalStrike) {
    // Satellite link indicator
    ctx.strokeStyle = '#4488ff';
    ctx.lineWidth = 1;
    for(let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(0, -20, 15 + i * 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

export default wide;
