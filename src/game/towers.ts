// @ts-nocheck
export const RARITY={COMMON:1, RARE:1.15, EPIC:1.35, LEGENDARY:1.6};
export const TOWER_TYPES=[
  { key:'basic', name:'Counter Toaster', cost:100, rarity:RARITY.COMMON, 
    desc:'Reliable two‑slot toaster. Pops heat pellets at loaves.',
    base:{range:120, fireRate:1, damage:12, projectileSpeed:300},
    upgrades:[
      {name:'Bagel Mode', cost:60, effect:t=>t.damage+=6, tip:'+6 dmg'},
      {name:'Crumb Catcher', cost:80, effect:t=>t.range+=25, tip:'+25 range'},
      {name:'Turbo Springs', cost:110, effect:t=>t.fireRate+=0.4, tip:'+0.4 firerate'},
    ]},
  { key:'wide', name:'4‑Slot Toaster', cost:160, rarity:RARITY.RARE,
    desc:'Wider heat, slower pop. Great coverage.',
    base:{range:150, fireRate:0.7, damage:16, projectileSpeed:260},
    upgrades:[
      {name:'Quartz Rods', cost:90, effect:t=>t.damage+=10, tip:'+10 dmg'},
      {name:'Heat Shield', cost:70, effect:t=>t.range+=35, tip:'+35 range'},
      {name:'Dual Thermostat', cost:120, effect:t=>t.fireRate+=0.35, tip:'+0.35 firerate'},
    ]},
  { key:'oven', name:'Mini Oven', cost:220, rarity:RARITY.RARE,
    desc:'Slow baker. Launches sizzling arcs (splash).',
    base:{range:170, fireRate:0.5, damage:30, projectileSpeed:220, splash:40, splashDmg:14},
    upgrades:[
      {name:'Convection Fan', cost:110, effect:t=>{t.fireRate+=0.25;}, tip:'+0.25 firerate'},
      {name:'Pizza Stone', cost:120, effect:t=>{t.damage+=16;}, tip:'+16 dmg'},
      {name:'Long Pan', cost:130, effect:t=>{t.range+=40;}, tip:'+40 range'},
    ]},
  { key:'microwave', name:'Microwave', cost:260, rarity:RARITY.EPIC,
    desc:'Zaps across lines instantly (pierce 2).',
    base:{range:190, fireRate:0.8, damage:18, projectileSpeed:999, pierce:2},
    upgrades:[
      {name:'Inverter Tech', cost:140, effect:t=>t.damage+=10, tip:'+10 dmg'},
      {name:'Wave Guide', cost:150, effect:t=>t.range+=50, tip:'+50 range'},
      {name:'Auto‑Reheat', cost:180, effect:t=>t.fireRate+=0.5, tip:'+0.5 firerate'},
    ]},
  { key:'airfryer', name:'Air Fryer', cost:340, rarity:RARITY.EPIC,
    desc:'Rapid-fire hot air blasts. Lower damage but extreme speed.',
    base:{range:140, fireRate:3.5, damage:8, projectileSpeed:450},
    upgrades:[
      {name:'Cyclone Mode', cost:160, effect:t=>t.fireRate+=1.2, tip:'+1.2 firerate'},
      {name:'Precision Jets', cost:140, effect:t=>t.damage+=6, tip:'+6 dmg'},
      {name:'Extended Basket', cost:180, effect:t=>t.range+=45, tip:'+45 range'},
    ]},
  { key:'convection', name:'Convection Oven', cost:420, rarity:RARITY.EPIC,
    desc:'Creates persistent heat zones that slow and damage.',
    base:{range:200, fireRate:0.3, damage:45, projectileSpeed:180, special:'heatzone'},
    upgrades:[
      {name:'Industrial Fan', cost:200, effect:t=>t.fireRate+=0.2, tip:'+0.2 firerate'},
      {name:'Ceramic Core', cost:180, effect:t=>t.damage+=25, tip:'+25 dmg'},
      {name:'Wide Vents', cost:220, effect:t=>t.range+=60, tip:'+60 range'},
    ]},
  { key:'industrial', name:'Industrial Toaster', cost:580, rarity:RARITY.LEGENDARY,
    desc:'Massive chrome beast. Devastating damage but very slow.',
    base:{range:250, fireRate:0.15, damage:120, projectileSpeed:200, splash:60, splashDmg:50},
    upgrades:[
      {name:'Tungsten Coils', cost:280, effect:t=>t.damage+=80, tip:'+80 dmg'},
      {name:'Hydraulic Lift', cost:320, effect:t=>t.fireRate+=0.1, tip:'+0.1 firerate'},
      {name:'Chrome Reflector', cost:300, effect:t=>{t.range+=80; t.splash+=20;}, tip:'+80 range, +20 splash'},
    ]},
  { key:'chef', name:'Chef Special Toaster', cost:480, rarity:RARITY.LEGENDARY,
    desc:'Adaptive AI targeting. Switches modes based on threat level.',
    base:{range:180, fireRate:1.2, damage:35, projectileSpeed:350, special:'adaptive'},
    upgrades:[
      {name:'Neural Network', cost:240, effect:t=>{t.adaptiveBonus=0.5;}, tip:'Enhanced adaptation'},
      {name:'Multi-Mode', cost:260, effect:t=>{t.damage+=20; t.fireRate+=0.3;}, tip:'+20 dmg, +0.3 firerate'},
      {name:'Quantum Sensors', cost:300, effect:t=>{t.range+=70; t.pierce=1;}, tip:'+70 range, +1 pierce'},
    ]},
];
export function getTowerBase(k){ return TOWER_TYPES.find(t=>t.key===k); }
