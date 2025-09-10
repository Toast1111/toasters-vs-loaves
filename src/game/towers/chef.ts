// @ts-nocheck
import { RARITY } from './shared';
import { roundedRect } from '../drawUtils';

const chef = {
  key:'chef', name:'Chef Special Toaster', cost:480, rarity:RARITY.LEGENDARY,
  desc:'Adaptive AI targeting. Switches modes based on threat level.',
  base:{range:180, fireRate:1.2, damage:35, projectileSpeed:350, special:'adaptive'},
  upgradePaths:[
    { // Path 0: Neural Networks
      name: 'AI Evolution',
      upgrades:[
        {name:'Neural Network', cost:240, tip:'Enhanced adaptation', 
         effect:t=>{t.adaptiveBonus=0.5; t.learningRate=1.2;}},
        {name:'Deep Learning', cost:410, tip:'Predicts enemy behavior, learns patterns', 
         effect:t=>{t.adaptiveBonus=1.0; t.learningRate=1.5; t.behaviorPrediction=true;}},
        {name:'Quantum Consciousness', cost:700, tip:'Consciousness emerges, perfect adaptation', 
         effect:t=>{t.adaptiveBonus=2.0; t.consciousness=true; t.perfectAdaptation=true;}},
        {name:'Artificial Superintelligence', cost:1200, tip:'Surpasses human intelligence, reality analysis', 
         effect:t=>{t.adaptiveBonus=4.0; t.superintelligence=true; t.realityAnalysis=true;}},
        {name:'Transcendent Mind', cost:2000, tip:'Beyond AI, manipulates causality itself', 
         effect:t=>{t.adaptiveBonus=8.0; t.transcendentMind=true; t.causalityManipulation=true; t.omniscience=true;}}
      ]
    },
    { // Path 1: Multi-Mode Systems
      name: 'Modular Systems',
      upgrades:[
        {name:'Multi-Mode', cost:260, tip:'+20 damage, +0.3 fire rate', 
         effect:t=>{t.damage+=20; t.fireRate+=0.3;}},
        {name:'Adaptive Arsenal', cost:450, tip:'+35 damage, +0.5 fire rate, multiple weapon types', 
         effect:t=>{t.damage+=35; t.fireRate+=0.5; t.weaponTypes=3; t.situationalWeapons=true;}},
        {name:'Modular Platform', cost:760, tip:'+55 damage, +0.8 fire rate, self-modifying', 
         effect:t=>{t.damage+=55; t.fireRate+=0.8; t.weaponTypes=5; t.selfModifying=true;}},
        {name:'Omniversal Arsenal', cost:1300, tip:'+90 damage, +1.3 fire rate, infinite weapon types', 
         effect:t=>{t.damage+=90; t.fireRate+=1.3; t.weaponTypes=999; t.omniversalWeapons=true;}},
        {name:'Reality Arsenal', cost:2200, tip:'Unlimited damage types, breaks physical laws', 
         effect:t=>{t.damage+=150; t.fireRate+=2.0; t.realityWeapons=true; t.lawBreaking=true; t.conceptualDamage=true;}}
      ]
    },
    { // Path 2: Quantum Sensors
      name: 'Sensor Networks',
      upgrades:[
        {name:'Quantum Sensors', cost:300, tip:'+70 range, +1 pierce', 
         effect:t=>{t.range+=70; t.pierce+=1;}},
        {name:'Dimensional Scanning', cost:510, tip:'+120 range, +2 pierce, sees through dimensions', 
         effect:t=>{t.range+=120; t.pierce+=2; t.dimensionalSight=true; t.phaseDetection=true;}},
        {name:'Temporal Sensors', cost:870, tip:'+200 range, +3 pierce, sees through time', 
         effect:t=>{t.range+=200; t.pierce+=3; t.temporalSight=true; t.futureTargeting=true;}},
        {name:'Omniversal Detection', cost:1500, tip:'+350 range, +5 pierce, sees all realities', 
         effect:t=>{t.range+=350; t.pierce+=5; t.omniversalSight=true; t.multiverseTargeting=true;}},
        {name:'Absolute Awareness', cost:2500, tip:'Unlimited range, infinite pierce, knows everything', 
         effect:t=>{t.range=9999; t.pierce=999; t.absoluteAwareness=true; t.omniscience=true; t.totalKnowledge=true;}}
      ]
    }
  ],
  draw(ctx){
    ctx.fillStyle="#9932cc"; roundedRect(ctx,-16,-14,32,28,6);
    ctx.fillStyle="#dda0dd"; roundedRect(ctx,-14,-12,28,10,4);
    // AI indicator
    ctx.fillStyle="#00ff00"; ctx.beginPath(); ctx.arc(8,0,3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#0066ff"; ctx.beginPath(); ctx.arc(-8,0,3,0,Math.PI*2); ctx.fill();
  }
};

export default chef;
