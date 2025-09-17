// @ts-nocheck
import { RARITY } from '../shared';
import { drawDefaultToaster } from '../../../../rendering/drawUtils';

const wide = {
  key:'wide', name:'4‑Slot Toaster', cost:160, rarity:RARITY.RARE,
  desc:'Wider heat, slower pop. Great coverage.',
  base:{range:150, fireRate:0.7, damage:16, projectileSpeed:260},
  upgradePaths:[
    { // Path 0: Area Devastation
      name: 'Area Control',
      upgrades:[
        {name:'Quartz Rods', cost:90, tip:'+10 damage', 
         effect:t=>t.damage+=10},
        {name:'Wide Spread', cost:160, tip:'+15 damage, larger projectiles', 
         effect:t=>{t.damage+=15; t.projectileSize=1.5;}},
        {name:'Heat Wave', cost:280, tip:'+20 damage, splash damage', 
         effect:t=>{t.damage+=20; t.splash=50; t.splashDmg=12;}},
        {name:'Thermal Burst', cost:450, tip:'+30 damage, bigger splash, stuns', 
         effect:t=>{t.damage+=30; t.splash=80; t.splashDmg=20; t.stunChance=0.3;}},
        {name:'Nuclear Toast', cost:750, tip:'Massive area damage, massive stun', 
         effect:t=>{t.damage+=60; t.splash=120; t.splashDmg=40; t.stunChance=0.7; t.stunDuration=2;}}
      ]
    },
    { // Path 1: Support & Economy  
      name: 'Heat Shield',
      upgrades:[
        {name:'Heat Shield', cost:70, tip:'+35 range', 
         effect:t=>t.range+=35},
        {name:'Thermal Barrier', cost:140, tip:'+50 range, blocks projectiles', 
         effect:t=>{t.range+=50; t.projectileBlock=true;}},
        {name:'Economic Heating', cost:240, tip:'+70 range, generates coins', 
         effect:t=>{t.range+=70; t.coinGeneration=2;}},
        {name:'Industrial Complex', cost:400, tip:'+100 range, boosts nearby towers', 
         effect:t=>{t.range+=100; t.coinGeneration=5; t.towerBoost={damage:1.2, fireRate:1.1};}},
        {name:'Mega Factory', cost:700, tip:'Global boost, massive coin generation', 
         effect:t=>{t.range+=150; t.coinGeneration=12; t.globalBoost=true; t.towerBoost={damage:1.5, fireRate:1.3};}}
      ]
    },
    { // Path 2: Precision & Speed
      name: 'Smart Targeting',
      upgrades:[
        {name:'Dual Thermostat', cost:120, tip:'+0.35 fire rate', 
         effect:t=>t.fireRate+=0.35},
        {name:'Smart Targeting', cost:200, tip:'+0.5 fire rate, prioritizes strong enemies', 
         effect:t=>{t.fireRate+=0.5; t.smartTargeting=true;}},
        {name:'Predictive AI', cost:350, tip:'+0.8 fire rate, lead targeting', 
         effect:t=>{t.fireRate+=0.8; t.leadTargeting=true; t.smartTargeting=true;}},
        {name:'Quantum Computer', cost:600, tip:'+1.2 fire rate, perfect accuracy', 
         effect:t=>{t.fireRate+=1.2; t.perfectAccuracy=true; t.alwaysHit=true;}},
        {name:'Sentient Toaster', cost:1000, tip:'Adaptive AI, controls other towers', 
         effect:t=>{t.fireRate+=2.0; t.aiControl=true; t.adaptiveTargeting=true; t.networkBoost=true;}}
      ]
    }
  ],
  draw(ctx){ drawDefaultToaster(ctx); }
};

export default wide;
