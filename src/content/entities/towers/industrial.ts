// @ts-nocheck
import { RARITY } from './shared';
import { roundedRect } from '../../../rendering/drawUtils';

const industrial = {
  key:'industrial', name:'Industrial Toaster', cost:580, rarity:RARITY.LEGENDARY,
  desc:'Massive chrome beast. Devastating damage but very slow.',
  base:{range:250, fireRate:0.15, damage:120, projectileSpeed:200, splash:60, splashDmg:50},
  upgradePaths:[
    { // Path 0: Raw Power
      name: 'Tungsten Mastery',
      upgrades:[
        {name:'Tungsten Coils', cost:280, tip:'+80 damage', 
         effect:t=>t.damage+=80},
        {name:'Reinforced Core', cost:480, tip:'+130 damage, armor piercing', 
         effect:t=>{t.damage+=130; t.armorPiercing=3;}},
        {name:'Adamantine Frame', cost:820, tip:'+200 damage, ignores all armor', 
         effect:t=>{t.damage+=200; t.armorPiercing=999; t.absolutePiercing=true;}},
        {name:'Quantum Annihilator', cost:1400, tip:'+350 damage, deletes enemy defenses', 
         effect:t=>{t.damage+=350; t.defenseDestruction=true; t.quantumDamage=true;}},
        {name:'Reality Crusher', cost:2400, tip:'Unimaginable damage, breaks game rules', 
         effect:t=>{t.damage+=700; t.realityBreaking=true; t.omnipotentDamage=true; t.transcendentPower=true;}}
      ]
    },
    { // Path 1: Hydraulic Systems
      name: 'Hydraulic Mastery',
      upgrades:[
        {name:'Hydraulic Lift', cost:320, tip:'+0.1 fire rate', 
         effect:t=>t.fireRate+=0.1},
        {name:'Pneumatic Systems', cost:550, tip:'+0.18 fire rate, knockback effects', 
         effect:t=>{t.fireRate+=0.18; t.knockback=true; t.knockbackPower=80;}},
        {name:'Steam Power', cost:940, tip:'+0.3 fire rate, steam clouds slow enemies', 
         effect:t=>{t.fireRate+=0.3; t.knockbackPower=120; t.steamClouds=true; t.steamSlowing=true;}},
        {name:'Hydraulic Overdrive', cost:1600, tip:'+0.5 fire rate, massive area control', 
         effect:t=>{t.fireRate+=0.5; t.steamClouds=true; t.hydraulicSlam=true; t.areaControl=true;}},
        {name:'Mechanical God', cost:2700, tip:'Ultra-speed, controls all machinery', 
         effect:t=>{t.fireRate+=1.0; t.mechanicalDominion=true; t.infiniteHydraulics=true; t.machineryControl=true;}}
      ]
    },
    { // Path 2: Chrome Perfection
      name: 'Chrome Mastery',
      upgrades:[
        {name:'Chrome Reflector', cost:300, tip:'+80 range, +20 splash', 
         effect:t=>{t.range+=80; t.splash+=20;}},
        {name:'Mirror Finish', cost:520, tip:'+130 range, +40 splash, reflects projectiles', 
         effect:t=>{t.range+=130; t.splash+=40; t.projectileReflection=true;}},
        {name:'Prismatic Array', cost:890, tip:'+200 range, +70 splash, splits light beams', 
         effect:t=>{t.range+=200; t.splash+=70; t.lightBeams=true; t.prismaticEffects=true;}},
        {name:'Perfect Mirror', cost:1500, tip:'+350 range, +120 splash, absolute reflection', 
         effect:t=>{t.range+=350; t.splash+=120; t.perfectReflection=true; t.lightAmplification=true;}},
        {name:'Cosmic Reflector', cost:2500, tip:'Unlimited range, reflects reality itself', 
         effect:t=>{t.range=9999; t.splash+=200; t.realityReflection=true; t.cosmicMirror=true; t.universalReflection=true;}}
      ]
    }
  ],
  draw(ctx){
    ctx.fillStyle="#778899"; roundedRect(ctx,-20,-18,40,36,8);
    ctx.fillStyle="#c0c0c0"; roundedRect(ctx,-18,-16,36,14,6);
    ctx.fillStyle="#1a1a1a"; roundedRect(ctx,-14,-10,28,12,4);
    // Chrome shine effect
    ctx.fillStyle="#ffffff44"; roundedRect(ctx,-16,-14,8,3,2);
  }
};

export default industrial;
