// @ts-nocheck
import { createInitialState } from "./state";
import { drawScene } from "./render";
import { buildWave } from "./waves";
import { isBuildable, waypoints } from "./map";
import { fireFrom, projectiles, stepProjectiles } from "./projectiles";
import { spawnCrumbs, particles, stepParticles, spawnMuzzleFlash, spawnExplosion } from "./particles";
import { TOWER_TYPES, getTowerBase, canUpgrade } from "./towers";
import { damageBread, spawnBread, breads, stepBreads } from "./breads";
import { stepEffects, createHeatZone, getAdaptiveTargeting, addScreenShake } from "./effects";
import { stepPowerups, tryCollectPowerup } from "./powerups";
import { stepAbilities, tryActivateAbility } from "./abilities";
import { stepStats, loadStats, recordTowerBuilt, recordWaveCompleted } from "./achievements";
import { UI } from "./ui";

export class Game{
  canvas; ctx; state; mouse={x:-999,y:-999}; last=performance.now();
  constructor(canvas, ctx){ this.canvas=canvas; this.ctx=ctx; this.state=createInitialState(canvas.width, canvas.height); }
  init(){
    UI.bind(this);
    loadStats(); // Load saved achievements and stats
    this.canvas.addEventListener('mousemove',e=>{ this.mouse.x=e.offsetX; this.mouse.y=e.offsetY; });
    this.canvas.addEventListener('mouseleave',()=>{ this.mouse.x=this.mouse.y=-9999; });
    this.canvas.addEventListener('click', e=>{
      const x=e.offsetX, y=e.offsetY;
      
      // Try to collect powerup first
      if (tryCollectPowerup(x, y, this.state)) {
        return;
      }
      
  const hit=this.state.toasters.findLast(t=>Math.hypot(x-t.x,y-t.y)<=18);
  if(hit){ this.state.selected=hit.id; UI.updateInspect(this); return; }
      if(this.state.placing){ this.tryPlaceTower(x,y, e.shiftKey); }
    });
    
    // Add keyboard controls for special abilities
    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT') return; // Don't trigger during typing
      tryActivateAbility(e.key, this);
    });
    
  UI.refreshCatalog(this); 
  UI.refreshTech(this); 
  UI.log('Welcome to Toasters vs Loaves! Place toasters and press Start Wave. Earn AP to buy Tech.'); 
  UI.log('💡 Special abilities: Q-Lightning, W-Heat Wave, E-Repair, R-Emergency Coins'); 
  }
  stepTime(now){ const dt=Math.min(0.033,(now-this.last)/1000); this.last=now; return dt; }
  tryPlaceTower(x,y,multi=false){
  if(!isBuildable(x,y)){ UI.float(this, x,y,'Not on loaf path!',true); return; }
    const type=this.state.placing; if(!type) return;
  if(this.state.coins<type.cost){ UI.float(this,x,y,'Not enough coins',true); return; }
  for(const t of this.state.toasters){ if(Math.hypot(x-t.x,y-t.y)<36){ UI.float(this,x,y,'Too close to another toaster',true); return; } }
    const inst=this.makeToaster(type,x,y);
    this.state.toasters.push(inst);
  this.state.coins-=type.cost; UI.sync(this);
  UI.log(`Placed ${type.name} for ${type.cost}c.`);
  UI.refreshCatalog(this);
    addScreenShake(2, 0.2); // Satisfying placement feedback
    recordTowerBuilt(type.key); // Record for achievements
    if(!multi) this.state.placing=null;
  }
  makeToaster(type,x,y){
    const id=this.state.idSeq++;
    const t={id, type:type.key, name:type.name, x,y,
      range:type.base.range*this.state.global.range,
      fireRate:type.base.fireRate*this.state.global.fireRate,
      damage:type.base.damage*this.state.global.damage,
      projectileSpeed:type.base.projectileSpeed||300,
      splash:type.base.splash||0, splashDmg:type.base.splashDmg||0,
      pierce:(type.base.pierce||0)+this.state.global.pierce,
      // New upgrade path system
      upgradeTiers:[0,0,0], // [path0, path1, path2] - tracks tier for each path
      cooldown:0, sold:false,
      special:type.base.special||null, adaptiveBonus:0};
    return t;
  }
  sellSelected(){
    const t=this.getSelected(); if(!t) return; t.sold=true;
    const value= Math.floor(0.8 * this.getTowerCost(t));
  this.state.coins+=value; UI.sync(this);
    this.state.toasters=this.state.toasters.filter(x=>x.id!==t.id);
  this.state.selected=null; UI.updateInspect(this); UI.refreshCatalog(this);
  UI.float(this,t.x,t.y,`+${value}c (sold)`);
  }
  getTowerCost(t){ 
    const base=getTowerBase(t.type).cost; 
    let spent=0; 
    const baseTower = getTowerBase(t.type);
    
    // Calculate cost based on new upgrade path system
    for(let pathIndex = 0; pathIndex < 3; pathIndex++) {
      const pathTier = t.upgradeTiers[pathIndex];
      const path = baseTower.upgradePaths[pathIndex];
      for(let tier = 0; tier < pathTier; tier++) {
        spent += path.upgrades[tier].cost;
      }
    }
    
    return base + spent; 
  }
  
  // New function to upgrade a specific path
  upgradeTowerPath(tower, pathIndex) {
    const baseTower = getTowerBase(tower.type);
    const currentTier = tower.upgradeTiers[pathIndex];
    
    // Check if upgrade is allowed using our constraint system
    if (!canUpgrade(tower, pathIndex, currentTier)) {
      UI.float(this, tower.x, tower.y, 'Upgrade blocked!', true);
      return false;
    }
    
    const path = baseTower.upgradePaths[pathIndex];
    if (currentTier >= path.upgrades.length) {
      return false; // Path maxed out
    }
    
    const upgrade = path.upgrades[currentTier];
    
    // Check if player has enough coins
    if (this.state.coins < upgrade.cost) {
      UI.float(this, tower.x, tower.y, 'Not enough coins!', true);
      return false;
    }
    
    // Apply the upgrade
    this.state.coins -= upgrade.cost;
    tower.upgradeTiers[pathIndex]++;
    upgrade.effect(tower);
    
    UI.float(this, tower.x, tower.y, `${upgrade.name}!`);
    UI.sync(this);
    UI.updateInspect(this);
    UI.refreshCatalog(this);
    
    return true;
  }
  getSelected(){ return this.state.toasters.find(t=>t.id===this.state.selected); }
  startWave(){
    if(this.state.waveInProgress) return; this.state.wave++; UI.sync(this); UI.log(`Wave ${this.state.wave} begins!`);
    this.state.waveQueue=buildWave(this.state.wave);
    this.state.spawnTimer=0; this.state.betweenWaves=false; this.state.waveInProgress=true; this.state.running=true;
  }
  update(dt){
    // spawn
    if(this.state.waveInProgress){
      this.state.spawnTimer-=dt;
      if(this.state.spawnTimer<=0 && this.state.waveQueue.length){ spawnBread(this.state.waveQueue.shift()); this.state.spawnTimer=0.45; }
      if(!this.state.waveQueue.length && breads.every(b=>!b.alive)){
  this.state.waveInProgress=false; this.state.betweenWaves=true;
  this.state.ap+=1; this.state.coins+=50+this.state.wave*10; UI.sync(this);
  UI.log(`Wave ${this.state.wave} cleared! +AP, +coins`);
        recordWaveCompleted(); // Record for achievements
      }
    }
    // enemies
  stepBreads(dt, this.state);
  // expose breads to state for modules that expect it
  this.state.breads = breads;
    // towers
    if(this.state.running){
      for(const t of this.state.toasters){
        t.cooldown-=dt; if(t.cooldown<0) t.cooldown=0;
        
        // Reset adaptive bonuses
        t._tempDamage = t.damage;
        t._tempFireRate = t.fireRate;
        t._tempRange = t.range;
        
        // Special targeting for adaptive towers
        let target = null;
        if (t.special === 'adaptive') {
          const enemiesInRange = breads.filter(e => 
            e.alive && Math.hypot(e.x - t.x, e.y - t.y) <= t.range);
          target = getAdaptiveTargeting(t, enemiesInRange);
        } else {
          // Standard targeting: closest-to-exit in range
          let best = Infinity;
          for(const e of breads){ 
            if(!e.alive) continue; 
            const d = Math.hypot(e.x-t.x, e.y-t.y); 
            if(d <= t.range){
              const score = (1000-e.wpt*50) + d*0.1; 
              if(score < best){ best = score; target = e; }
            }
          }
        }
        
        if(target && t.cooldown === 0){ 
          // Calculate actual damage with critical hits
          let actualDamage = t._tempDamage || t.damage;
          if(t.critChance && Math.random() < t.critChance) {
            actualDamage *= (t.critMultiplier || 2.0);
            UI.float(this, target.x, target.y, 'CRIT!', false);
            
            // Crit explosions upgrade
            if(t.critExplosions) {
              // Create a small explosion at target
              spawnExplosion(target.x, target.y, 30);
              // Damage nearby enemies
              for(const e2 of breads) {
                if(!e2.alive || e2 === target) continue;
                const dist = Math.hypot(target.x - e2.x, target.y - e2.y);
                if(dist < 50) {
                  damageBread(e2, actualDamage * 0.3, this.state);
                }
              }
            }
          }
          
          // Special behavior for convection ovens
          if (t.special === 'heatzone') {
            createHeatZone(target.x, target.y, 45, 8, 2.5);
            addScreenShake(3, 0.15);
          } else {
            // Add muzzle flash
            const angle = Math.atan2(target.y - t.y, target.x - t.x);
            spawnMuzzleFlash(t.x, t.y, angle);
            fireFrom(t, target, actualDamage); 
            
            // Double shot upgrade
            if(t.doubleShot && Math.random() < t.doubleShot) {
              // Small delay for second shot
              setTimeout(() => {
                if(target.alive) {
                  fireFrom(t, target, actualDamage * 0.8);
                  spawnMuzzleFlash(t.x, t.y, angle);
                }
              }, 50);
            }
          }
          
          const effectiveFireRate = t._tempFireRate || t.fireRate;
          t.cooldown = Math.max(0.02, 1/effectiveFireRate); 
        }
      }
    }
    stepProjectiles(dt, this.state);
    stepParticles(dt);
  stepEffects(dt, this.state);
    stepPowerups(dt, this.state);
    stepAbilities(dt);
    stepStats(dt); // Track playtime and other stats
  }
  draw(){ drawScene(this.ctx, this.state); }
}
