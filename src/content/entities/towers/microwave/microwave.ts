// @ts-nocheck
import { RARITY } from '../shared';
import { drawDefaultToaster } from '../../../../rendering/drawUtils';

const microwave = {
  key:'microwave', name:'Microwave', cost:260, rarity:RARITY.EPIC,
  desc:'Radiation-powered tower with limited energy capacity. Pierces multiple enemies.',
  base:{range:190, fireRate:0.8, damage:18, projectileSpeed:999, pierce:2, radiationCapacity:4, radiationRegenRate:1.2, reloadTime:2.5},
  upgradePaths:[
    { // Path 0: Pierce Specialist (Overloaded Shots)
      name: 'Pierce Specialist',
      upgrades:[
        {name:'Focused Beam', cost:140, tip:'Pierce increased by 1', 
         effect:t=>t.pierce+=1},
        {name:'Overcharged Core', cost:240, tip:'Pierce +2, but radiation capacity -2', 
         effect:t=>{t.pierce+=2; t.radiationCapacity-=2;}},
        {name:'Overload Cooking', cost:420, tip:'+15 damage per enemy pierced', 
         effect:t=>{t.overloadDamage=5; t.pierceDamageBonus=true;}},
        {name:'Radiation Lance', cost:700, tip:'Infinite pierce, drains all ammo per shot', 
         effect:t=>{t.pierce=999; t.radiationLance=true; t.drainsAllAmmo=true;}},
        {name:'Nuclear Reheat', cost:1200, tip:'Piercing shots explode into AoE after traveling', 
         effect:t=>{t.nuclearReheat=true; t.explosionRadius=80; t.explosionDamage=50; t.travelExplosion=true;}}
      ]
    },
    { // Path 1: Control Specialist (Range + Utility)
      name: 'Control Specialist',
      upgrades:[
        {name:'Extended Array', cost:150, tip:'Range increased by 70', 
         effect:t=>t.range+=70},
        {name:'Wave Pusher', cost:260, tip:'Mild knockback effect when hitting enemies', 
         effect:t=>{t.knockback=15; t.knockbackUniversal=true;}},
        {name:'Static Shock', cost:450, tip:'5% chance to stun enemies for 0.5s', 
         effect:t=>{t.stunChance=0.05; t.stunDuration=0.5;}},
        {name:'Pulse Microwave', cost:750, tip:'Emits periodic shockwave that slows all enemies in range', 
         effect:t=>{t.pulseWave=true; t.pulseInterval=2.0; t.pulseSlowEffect=0.3; t.pulseSlowDuration=1.5;}},
        {name:'Orbital Oven', cost:1300, tip:'Massive range boost (nearly global), but reload time doubles', 
         effect:t=>{t.range=800; t.reloadTime*=2.0; t.orbitalRange=true;}}
      ]
    },
    { // Path 2: Radiation Battery (Ammo Capacity / Burst DPS)
      name: 'Radiation Battery',
      upgrades:[
        {name:'Power Cell', cost:180, tip:'Radiation energy capacity increased by 1', 
         effect:t=>t.radiationCapacity+=1},
        {name:'Turbo Magnetron', cost:300, tip:'Ammo recharges faster (universal upgrade)', 
         effect:t=>{t.reloadTime*=0.67; t.turboMagnetron=true;}},
        {name:'Energy Hoarder', cost:520, tip:'+3 capacity but -1 damage per shot', 
         effect:t=>{t.radiationCapacity+=3; t.damage-=1;}},
        {name:'Dualwave Mode', cost:880, tip:'Fires 2 independent beams per shot, consuming 2 energy', 
         effect:t=>{t.dualWave=true; t.independentTargeting=true; t.energyPerShot=2;}},
        {name:'Gamma Burst', cost:1500, tip:'First shot after full recharge causes chain lightning (8 enemies, 2s stun)', 
         effect:t=>{t.gammaBurst=true; t.gammaMultiplier=3.0; t.fullRechargeBonus=true; t.chainLightning=true; t.chainCount=8; t.chainStunDuration=2.0;}}
      ]
    }
  ],
  draw(ctx){ drawDefaultToaster(ctx); }
};

export default microwave;
