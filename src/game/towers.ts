// @ts-nocheck
export const RARITY={COMMON:1, RARE:1.15, EPIC:1.35};
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
];
export function getTowerBase(k){ return TOWER_TYPES.find(t=>t.key===k); }
