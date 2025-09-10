// @ts-nocheck
import { createInitialState } from "./state";
import { drawScene } from "./render";
import { buildWave } from "./waves";
import { isBuildable, waypoints } from "./map";
import { fireFrom, projectiles, stepProjectiles } from "./projectiles";
import { spawnCrumbs, particles, stepParticles, spawnMuzzleFlash, spawnExplosion } from "./particles";
import { TOWER_TYPES, getTowerBase, canUpgrade } from "./towers/index";
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
        let hasEnemiesInRange = false;
        
        if (t.special === 'adaptive') {
          const enemiesInRange = breads.filter(e => 
            e.alive && Math.hypot(e.x - t.x, e.y - t.y) <= t.range);
          target = getAdaptiveTargeting(t, enemiesInRange);
          hasEnemiesInRange = enemiesInRange.length > 0;
        } else if (t.tackShooter) {
          // Tack shooter doesn't need specific target, just enemies in range (unless alwaysFire is true)
          if (t.alwaysFire) {
            hasEnemiesInRange = true; // Always fire regardless of enemies
          } else {
            hasEnemiesInRange = breads.some(e => 
              e.alive && Math.hypot(e.x - t.x, e.y - t.y) <= t.range);
          }
        } else {
          // Standard targeting: closest-to-exit in range
          let best = Infinity;
          for(const e of breads){ 
            if(!e.alive) continue; 
            const d = Math.hypot(e.x-t.x, e.y-t.y); 
            if(d <= t.range){
              hasEnemiesInRange = true;
              const score = (1000-e.wpt*50) + d*0.1; 
              if(score < best){ best = score; target = e; }
            }
          }
        }
        
        // Charge-shot mode: tier 3+ on Air Fryer path 2 replaces normal attack with charge system
        let suppressNormalShot = false;
        if (t.chargeShot) {
          suppressNormalShot = true; // Always suppress normal shots in charge mode
          
          // Find enemies in range to decide charge or fire
          const enemiesInRange = breads.filter(e => e.alive && Math.hypot(e.x - t.x, e.y - t.y) <= t.range);
          
          // Charging logic
          if ((t._gatlingTime||0) <= 0) {
            if (enemiesInRange.length > 0) {
              t._charge = (t._charge || 0) + dt;
            } else {
              t._charge = Math.max(0, (t._charge||0) - dt*0.5); // bleed off when no targets
            }
            
            // When fully charged, begin barrage
            if ((t._charge||0) >= (t.chargeTime||2)) {
              t._gatlingTime = t.gatlingDuration || 1.2;
              t._charge = 0;
            }
          }
          
          // During barrage: fire a cone of rapid shots
          if ((t._gatlingTime||0) > 0) {
            t._gatlingTime -= dt;
            // Rate control
            t._gatlingCooldown = Math.max(0, (t._gatlingCooldown||0) - dt);
            if (t._gatlingCooldown === 0) {
              // Aim toward average direction of nearby enemies; fallback any
              let aimX = 0, aimY = 0, count = 0;
              for (const e of enemiesInRange) { aimX += e.x; aimY += e.y; count++; }
              let baseAngle;
              if (count > 0) {
                aimX /= count; aimY /= count; baseAngle = Math.atan2(aimY - t.y, aimX - t.x);
              } else if (target) {
                baseAngle = Math.atan2(target.y - t.y, target.x - t.x);
              } else {
                baseAngle = 0; // default
              }
              const cone = t.coneRadians || 0.8;
              const shots = 6; // per volley
              for (let i = 0; i < shots; i++) {
                const offset = (Math.random()-0.5)*cone;
                const dummyTarget = { x: t.x + Math.cos(baseAngle+offset)*t.range, y: t.y + Math.sin(baseAngle+offset)*t.range };
                fireFrom(t, dummyTarget, t.damage*0.8); // Increased damage since this replaces normal attack
                const angle = baseAngle + offset;
                spawnMuzzleFlash(t.x, t.y, angle);
              }
              t._gatlingCooldown = 1 / (t.gatlingRate || 18);
            }
          }
        }
        if(!suppressNormalShot && t.cooldown === 0 && (target || (t.tackShooter && hasEnemiesInRange))){ 
          // Calculate actual damage with critical hits
          let actualDamage = t._tempDamage || t.damage;
          if(t.critChance && Math.random() < t.critChance) {
            actualDamage *= (t.critMultiplier || 2.0);
            if(target) UI.float(this, target.x, target.y, 'CRIT!', false);
            
            // Crit explosions upgrade
            if(t.critExplosions && target) {
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
          } else if (t.tackShooter) {
            // Pressure cooker tack shooter - shoots in all directions
            const tackCount = t.tackCount || 8;
            const angleStep = (Math.PI * 2) / tackCount;
            
            for (let i = 0; i < tackCount; i++) {
              const angle = i * angleStep;
              spawnMuzzleFlash(t.x, t.y, angle);
              
              const projectile = {
                x: t.x, y: t.y,
                vx: Math.cos(angle) * (t.projectileSpeed * 0.8),
                vy: Math.sin(angle) * (t.projectileSpeed * 0.8),
                damage: actualDamage,
                lifetime: t.projectileLifetime || 0.4,
                explosive: t.explosiveProjectiles || false,
                explosionRadius: t.explosionRadius || 30,
                source: t
              };
              projectiles.push(projectile);
            }
          } else if (t.explosiveProjectiles || t.radialExplosion) {
            // Legacy explosive projectiles (for other towers)
            const angle = Math.atan2(target.y - t.y, target.x - t.x);
            spawnMuzzleFlash(t.x, t.y, angle);
            
            // Create short-lived explosive projectile
            const projectile = {
              x: t.x, y: t.y, 
              vx: Math.cos(angle) * (t.projectileSpeed * 0.7), 
              vy: Math.sin(angle) * (t.projectileSpeed * 0.7),
              damage: actualDamage,
              lifetime: t.projectileLifetime || 0.3,
              explosive: true,
              explosionRadius: t.explosionRadius || 40,
              source: t
            };
            projectiles.push(projectile);
            
            // Continuous bursts create multiple projectiles
            if (t.continuousBursts) {
              for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                  const burstAngle = angle + (Math.random() - 0.5) * 0.8;
                  const burstProjectile = {
                    x: t.x, y: t.y,
                    vx: Math.cos(burstAngle) * (t.projectileSpeed * 0.5),
                    vy: Math.sin(burstAngle) * (t.projectileSpeed * 0.5),
                    damage: actualDamage * 0.6,
                    lifetime: t.projectileLifetime || 0.2,
                    explosive: true,
                    explosionRadius: t.explosionRadius || 40,
                    source: t
                  };
                  projectiles.push(burstProjectile);
                  spawnMuzzleFlash(t.x, t.y, burstAngle);
                }, i * 100);
              }
            }
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
