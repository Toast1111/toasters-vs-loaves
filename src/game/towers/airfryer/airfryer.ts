// @ts-nocheck
import { RARITY } from '../shared';
import { AirfryerVisualManager } from './visuals';

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
        {name:'Tornado Generator', cost:480, tip:'+2.5 fire rate, CHANGES ATTACK: Charge up shots instead of constant fire', 
         effect:t=>{t.fireRate+=2.5; t.multiShot=3; t.tornadoEffect=true; 
           // Charge Shot mode config (replaces normal attack)
           t.chargeShot=true; t.chargeTime=2.0; t.gatlingDuration=1.4; t.gatlingRate=18; t.coneRadians=0.9; 
           t._charge=0; t._gatlingTime=0; t._gatlingCooldown=0;}},
        {name:'Hurricane Engine', cost:800, tip:'+3.5 fire rate, creates hurricane zones', 
         effect:t=>{t.fireRate+=3.5; t.multiShot=5; t.hurricaneZones=true; t.persistentTornados=true;}},
        {name:'Atmospheric Devastator', cost:1350, tip:'Ultimate speed, reality-bending winds', 
         effect:t=>{t.fireRate+=6.0; t.multiShot=8; t.realityBendingWinds=true; t.dimensionalVortex=true;}}
      ]
    }
  ],
  draw(ctx, t, state){
    // Initialize animation state
    t._ring = (t._ring || 0);
    t._steam = (t._steam || 0);
    
    // Get and call the appropriate visual function based on upgrades
    const visualFunc = AirfryerVisualManager.getVisualFunction(t.upgradeTiers);
    visualFunc(ctx, t, state);
  }
};

export default airfryer;