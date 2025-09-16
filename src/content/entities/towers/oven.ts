// @ts-nocheck
import { RARITY } from './shared';
import { drawDefaultToaster } from '../../../rendering/drawUtils';

const oven = {
  key:'oven', name:'Mini Oven', cost:220, rarity:RARITY.RARE,
  desc:'Slow baker. Launches sizzling arcs (splash).',
  base:{range:170, fireRate:0.5, damage:30, projectileSpeed:220, splash:40, splashDmg:14},
  upgradePaths:[
    { // Path 0: Explosive Cooking
      name: 'Explosive Cuisine',
      upgrades:[
        {name:'Pizza Stone', cost:120, tip:'+16 damage', 
         effect:t=>t.damage+=16},
        {name:'Molten Core', cost:200, tip:'+25 damage, +10 splash damage', 
         effect:t=>{t.damage+=25; t.splashDmg+=10;}},
        {name:'Volcanic Oven', cost:350, tip:'+40 damage, leaves fire patches', 
         effect:t=>{t.damage+=40; t.splashDmg+=20; t.firePatches=true; t.fireDuration=3; t.damageType='fire'; t.splashType='fire';}},
        {name:'Magma Chamber', cost:600, tip:'+70 damage, spreading fire', 
         effect:t=>{t.damage+=70; t.splashDmg+=35; t.fireSpread=true; t.fireDuration=5; t.damageType='fire'; t.splashType='fire';}},
        {name:'Planetary Forge', cost:1000, tip:'Devastating explosions, permanent fire zones', 
         effect:t=>{t.damage+=120; t.splashDmg+=60; t.splash+=40; t.permanentFire=true; t.chainExplosions=true; t.damageType='fire'; t.splashType='fire';}}
      ]
    },
    { // Path 1: Convection Master
      name: 'Convection Control',
      upgrades:[
        {name:'Convection Fan', cost:110, tip:'+0.25 fire rate', 
         effect:t=>t.fireRate+=0.25},
        {name:'Air Circulation', cost:180, tip:'+0.4 fire rate, pulls enemies closer', 
         effect:t=>{t.fireRate+=0.4; t.enemyPull=true; t.pullStrength=20;}},
        {name:'Cyclone Oven', cost:320, tip:'+0.6 fire rate, stronger pull, slows enemies', 
         effect:t=>{t.fireRate+=0.6; t.pullStrength=40; t.cycloneSlowing=true;}},
        {name:'Hurricane Force', cost:550, tip:'+1.0 fire rate, massive pull, damages over time', 
         effect:t=>{t.fireRate+=1.0; t.pullStrength=80; t.hurricaneDamage=15; t.pullDamage=true;}},
        {name:'Atmospheric Processor', cost:900, tip:'Global weather control, ultimate pull power', 
         effect:t=>{t.fireRate+=1.5; t.globalWeather=true; t.pullStrength=150; t.weatherDamage=30;}}
      ]
    },
    { // Path 2: Long Range Artillery  
      name: 'Artillery Platform',
      upgrades:[
        {name:'Long Pan', cost:130, tip:'+40 range', 
         effect:t=>t.range+=40},
        {name:'Mortar Mode', cost:220, tip:'+70 range, indirect fire', 
         effect:t=>{t.range+=70; t.indirectFire=true; t.mortarTrajectory=true;}},
        {name:'Siege Engine', cost:380, tip:'+120 range, penetrates armor', 
         effect:t=>{t.range+=120; t.armorPiercing=true; t.siegeMode=true;}},
        {name:'Artillery Platform', cost:650, tip:'+200 range, multiple targets', 
         effect:t=>{t.range+=200; t.multiTarget=3; t.artilleryBarrage=true;}},
        {name:'Orbital Cannon', cost:1100, tip:'Map-wide range, devastating barrages', 
         effect:t=>{t.range=9999; t.multiTarget=8; t.orbitalStrike=true; t.mapWideBombardment=true;}}
      ]
    }
  ],
  draw(ctx){ drawDefaultToaster(ctx); }
};

export default oven;
