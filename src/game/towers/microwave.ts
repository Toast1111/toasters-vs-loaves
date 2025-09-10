// @ts-nocheck
import { RARITY } from './shared';

const microwave = {
  key:'microwave', name:'Microwave', cost:260, rarity:RARITY.EPIC,
  desc:'Zaps across lines instantly (pierce 2).',
  base:{range:190, fireRate:0.8, damage:18, projectileSpeed:999, pierce:2},
  upgradePaths:[
    { // Path 0: Power Amplification
      name: 'Microwave Mastery',
      upgrades:[
        {name:'Inverter Tech', cost:140, tip:'+10 damage', 
         effect:t=>t.damage+=10},
        {name:'High Frequency', cost:240, tip:'+18 damage, +1 pierce', 
         effect:t=>{t.damage+=18; t.pierce+=1;}},
        {name:'Radar Array', cost:420, tip:'+30 damage, +2 pierce, seeks targets', 
         effect:t=>{t.damage+=30; t.pierce+=2; t.homing=true;}},
        {name:'Phased Array', cost:700, tip:'+50 damage, +3 pierce, bounces between enemies', 
         effect:t=>{t.damage+=50; t.pierce+=3; t.ricochet=true; t.bounceCount=3;}},
        {name:'Quantum Entanglement', cost:1200, tip:'Massive damage, infinite pierce, teleports', 
         effect:t=>{t.damage+=100; t.pierce=999; t.quantumTeleport=true; t.dimensionalRift=true;}}
      ]
    },
    { // Path 1: Microwave Networks
      name: 'Network Control',
      upgrades:[
        {name:'Wave Guide', cost:150, tip:'+50 range', 
         effect:t=>t.range+=50},
        {name:'Relay Tower', cost:260, tip:'+80 range, chains to other microwaves', 
         effect:t=>{t.range+=80; t.networkChain=true;}},
        {name:'Signal Booster', cost:450, tip:'+120 range, boosts networked towers', 
         effect:t=>{t.range+=120; t.networkBoost={damage:1.3, fireRate:1.2};}},
        {name:'Satellite Network', cost:750, tip:'+200 range, shares targeting data', 
         effect:t=>{t.range+=200; t.sharedTargeting=true; t.satelliteUplink=true;}},
        {name:'Global Grid', cost:1300, tip:'Unlimited range, controls all electronics', 
         effect:t=>{t.range=9999; t.globalControl=true; t.disruptsEnemyElectronics=true; t.empPulse=true;}}
      ]
    },
    { // Path 2: Rapid Pulse
      name: 'Pulse Generator', 
      upgrades:[
        {name:'Auto‑Reheat', cost:180, tip:'+0.5 fire rate', 
         effect:t=>t.fireRate+=0.5},
        {name:'Pulse Mode', cost:300, tip:'+0.8 fire rate, bursts of 3', 
         effect:t=>{t.fireRate+=0.8; t.burstFire=3; t.burstDelay=0.1;}},
        {name:'Rapid Cycling', cost:520, tip:'+1.2 fire rate, bursts of 5', 
         effect:t=>{t.fireRate+=1.2; t.burstFire=5; t.rapidCycling=true;}},
        {name:'Overclocked Array', cost:880, tip:'+2.0 fire rate, continuous beam', 
         effect:t=>{t.fireRate+=2.0; t.continuousBeam=true; t.overclocked=true;}},
        {name:'Temporal Accelerator', cost:1500, tip:'Time manipulation, ultra-rapid fire', 
         effect:t=>{t.fireRate+=4.0; t.timeManipulation=true; t.temporalAcceleration=true; t.slowsTime=true;}}
      ]
    }
  ]
};

export default microwave;
