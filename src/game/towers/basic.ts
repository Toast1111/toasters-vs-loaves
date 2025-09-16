// @ts-nocheck
import { RARITY } from './shared';
import { drawDefaultToaster } from '../drawUtils';

const basic = {
  key:'basic', name:'Counter Toaster', cost:100, rarity:RARITY.COMMON, 
  desc:'Reliable two‑slot toaster. Pops heat pellets at loaves.',
  base:{range:120, fireRate:1, damage:12, projectileSpeed:300},
  upgradePaths:[
    { // Path 0: Heat Mastery - Damage focused
      name: 'Heat Mastery',
      upgrades:[
        {name:'Bagel Mode', cost:60, tip:'+6 damage', 
         effect:t=>t.damage+=6},
        {name:'Precision Coils', cost:120, tip:'+10 damage, +0.2 fire rate', 
         effect:t=>{t.damage+=10; t.fireRate+=0.2;}},
        {name:'Tungsten Elements', cost:200, tip:'+15 damage, burns enemies', 
         effect:t=>{t.damage+=15; t.burnChance=0.3; t.burnDamage=5; t.damageType='fire';}},
        {name:'Plasma Injection', cost:350, tip:'+25 damage, stronger burns', 
         effect:t=>{t.damage+=25; t.burnChance=0.5; t.burnDamage=10; t.damageType='fire';}},
        {name:'Solar Core', cost:600, tip:'Massive damage, burn spreads', 
         effect:t=>{t.damage+=50; t.burnChance=0.8; t.burnDamage=20; t.burnSpread=true; t.damageType='fire';}}
      ]
    },
    { // Path 1: Range & Detection - Utility focused
      name: 'Detection Array',
      upgrades:[
        {name:'Crumb Catcher', cost:80, tip:'+25 range', 
         effect:t=>t.range+=25},
        {name:'Heat Sensor', cost:150, tip:'+40 range, detects cloaked', 
         effect:t=>{t.range+=40; t.camoDetection=true;}},
        {name:'Thermal Scope', cost:250, tip:'+60 range, slows enemies', 
         effect:t=>{t.range+=60; t.slowChance=0.4; t.slowAmount=0.3; t.damageType='frost';}},
        {name:'Satellite Link', cost:420, tip:'+100 range, reveals all enemies', 
         effect:t=>{t.range+=100; t.globalDetection=true; t.slowChance=0.6;}},
        {name:'Orbital Strike', cost:800, tip:'Unlimited range, devastating slow', 
         effect:t=>{t.unlimitedRange=true; t.slowChance=0.9; t.slowAmount=0.7; t.orbital=true; t.damageType='frost';}}
      ]
    },
    { // Path 2: Rapid Fire - Speed focused
      name: 'Rapid Response',
      upgrades:[
        {name:'Turbo Springs', cost:110, tip:'+0.4 fire rate', 
         effect:t=>t.fireRate+=0.4},
        {name:'Auto-Cycle', cost:180, tip:'+0.6 fire rate, chance for double shot', 
         effect:t=>{t.fireRate+=0.6; t.doubleShot=0.2;}},
        {name:'Chain Reaction', cost:300, tip:'+0.8 fire rate, pierce +1', 
         effect:t=>{t.fireRate+=0.8; t.pierce+=1; t.doubleShot=0.35;}},
        {name:'Overcharge Mode', cost:500, tip:'+1.2 fire rate, pierce +2, chain lightning', 
         effect:t=>{t.fireRate+=1.2; t.pierce+=2; t.chainLightning=true; t.doubleShot=0.5;}},
        {name:'Quantum Burst', cost:900, tip:'Ultra-fast firing, splits projectiles', 
         effect:t=>{t.fireRate+=2.0; t.pierce+=3; t.projectileSplit=3; t.doubleShot=0.8;}}
      ]
    }
  ],
  draw(ctx){ drawDefaultToaster(ctx); }
};

export default basic;
