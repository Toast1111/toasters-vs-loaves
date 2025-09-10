// @ts-nocheck
import { RARITY } from './shared';
import { roundedRect } from '../drawUtils';

const convection = {
  key:'convection', name:'Convection Oven', cost:420, rarity:RARITY.EPIC,
  desc:'Creates persistent heat zones that slow and damage.',
  base:{range:200, fireRate:0.3, damage:45, projectileSpeed:180, special:'heatzone'},
  upgradePaths:[
    { // Path 0: Zone Control
      name: 'Thermal Dominion',
      upgrades:[
        {name:'Ceramic Core', cost:180, tip:'+25 damage', 
         effect:t=>t.damage+=25},
        {name:'Heat Sink Array', cost:310, tip:'+40 damage, zones last longer', 
         effect:t=>{t.damage+=40; t.zoneDuration=1.5;}},
        {name:'Molten Foundation', cost:530, tip:'+65 damage, zones spread', 
         effect:t=>{t.damage+=65; t.zoneDuration=2.0; t.zoneSpread=true;}},
        {name:'Infernal Engine', cost:900, tip:'+100 damage, overlapping zones amplify', 
         effect:t=>{t.damage+=100; t.zoneDuration=3.0; t.zoneAmplification=true; t.stackingZones=true;}},
        {name:'Apocalypse Furnace', cost:1500, tip:'Massive damage, permanent heat zones', 
         effect:t=>{t.damage+=200; t.permanentZones=true; t.globalHeatDamage=true; t.apocalypticHeat=true;}}
      ]
    },
    { // Path 1: Industrial Scale
      name: 'Industrial Complex',
      upgrades:[
        {name:'Industrial Fan', cost:200, tip:'+0.2 fire rate', 
         effect:t=>t.fireRate+=0.2},
        {name:'Assembly Line', cost:340, tip:'+0.35 fire rate, automated production', 
         effect:t=>{t.fireRate+=0.35; t.automation=true; t.resourceGeneration=3;}},
        {name:'Factory Network', cost:580, tip:'+0.5 fire rate, boosts production towers', 
         effect:t=>{t.fireRate+=0.5; t.resourceGeneration=6; t.factoryBoost=true;}},
        {name:'Mega Complex', cost:980, tip:'+0.8 fire rate, mass production bonuses', 
         effect:t=>{t.fireRate+=0.8; t.resourceGeneration=12; t.massProduction=true; t.efficiencyBonus=true;}},
        {name:'Planetary Foundry', cost:1650, tip:'Ultimate production, reshapes battlefield', 
         effect:t=>{t.fireRate+=1.5; t.resourceGeneration=25; t.planetaryControl=true; t.terraforming=true;}}
      ]
    },
    { // Path 2: Wide Area
      name: 'Thermal Expansion',
      upgrades:[
        {name:'Wide Vents', cost:220, tip:'+60 range', 
         effect:t=>t.range+=60},
        {name:'Thermal Network', cost:380, tip:'+100 range, links zones together', 
         effect:t=>{t.range+=100; t.thermalNetwork=true; t.linkedZones=true;}},
        {name:'Continental Heater', cost:650, tip:'+170 range, affects entire regions', 
         effect:t=>{t.range+=170; t.continentalRange=true; t.regionalEffects=true;}},
        {name:'Global Warming', cost:1100, tip:'+300 range, planet-wide effects', 
         effect:t=>{t.range+=300; t.globalWarming=true; t.planetWideHeat=true;}},
        {name:'Stellar Manipulator', cost:1800, tip:'Unlimited range, controls solar energy', 
         effect:t=>{t.range=9999; t.stellarControl=true; t.solarManipulation=true; t.starPower=true;}}
      ]
    }
  ],
  draw(ctx){
    ctx.fillStyle="#c67e3b"; roundedRect(ctx,-18,-16,36,32,8);
    ctx.fillStyle="#e2945a"; roundedRect(ctx,-16,-14,32,12,6);
    ctx.fillStyle="#8b4513"; roundedRect(ctx,-12,-8,24,8,4);
    // Heat wave effect
    ctx.strokeStyle="#ff6b35aa"; ctx.lineWidth=1;
    for(let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.arc(0,0,12+i*4,0,Math.PI*2); ctx.stroke();
    }
  }
};

export default convection;
