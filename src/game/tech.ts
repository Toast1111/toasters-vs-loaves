// @ts-nocheck
export const TECHS=[
  {key:'heat1', name:'High‑Temp Nichrome', cost:1, desc:'+10% damage to all appliances', action:(game)=>{for(const t of game.state.toasters) t.damage*=1.1; game.state.global.damage*=1.1;}},
  {key:'coil1', name:'Coil Efficiency', cost:1, desc:'+10% fire rate to all', action:(game)=>{for(const t of game.state.toasters) t.fireRate*=1.1; game.state.global.fireRate*=1.1;}},
  {key:'range1', name:'Insulated Housing', cost:1, desc:'+10% range to all', action:(game)=>{for(const t of game.state.toasters) t.range*=1.1; game.state.global.range*=1.1;}},
  {key:'economy', name:'Coupon Clipping', cost:2, desc:'+15% coin bounty', action:(game)=>{game.state.global.bounty*=1.15;}},
  {key:'pierce', name:'Serrated Slots', cost:3, desc:'Projectiles pierce +1', action:(game)=>{game.state.global.pierce=(game.state.global.pierce||0)+1;}},
];
