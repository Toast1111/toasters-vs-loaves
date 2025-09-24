// @ts-nocheck
import { createInitialState } from "./state";
import { drawScene } from "../rendering/render";
import { buildWave, buildBossWave } from "../content/waves";
import { isBuildable, waypoints, getLevel, isBuildableOnLevel } from "../content/maps";
import { fireFrom, projectiles, stepProjectiles } from "../systems/projectiles";
import { spawnCrumbs, particles, stepParticles, spawnMuzzleFlash, spawnExplosion } from "../systems/particles";
import { TOWER_TYPES, getTowerBase, canUpgrade } from "../content/entities/towers";
import { damageBread, spawnBread, breads, stepBreads } from "../content/entities/breads";
import { stepEffects, createHeatZone, getAdaptiveTargeting, addScreenShake } from "../systems/effects";
import { stepPowerups, tryCollectPowerup } from "../systems/powerups";
import { stepAbilities, tryActivateAbility } from "../systems/abilities";
import { stepStats, loadStats, recordTowerBuilt, recordWaveCompleted } from "../systems/achievements";
import { UI } from "../ui/game";

export class Game{
  canvas; ctx; state; mouse={x:-999,y:-999}; last=performance.now();
  constructor(canvas, ctx, levelId){ 
    this.canvas=canvas; this.ctx=ctx; 
    this.state=createInitialState(canvas.width, canvas.height); 
    // Attach level definition (fallback training_kitchen)
    this.state.currentLevel = getLevel(levelId || 'training_kitchen');
  }
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
  if(hit){ 
    this.state.selected=hit.id; 
    UI.updateInspect(this); 
    UI.showTowerPopup(hit);
    return; 
  }
      if(this.state.placing){ 
        this.tryPlaceTower(x,y, e.shiftKey); 
      } else {
        // Clicked empty space - deselect tower and close popup
        if (this.state.selected) {
          this.state.selected = null;
          UI.updateInspect(this);
          UI.hideTowerPopup();
        }
        // Also clear any tower placement selection
        if (this.state.placing) {
          this.state.placing = null;
          UI.refreshCatalog(this);
        }
      }
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
  const buildable = this.state.currentLevel ? isBuildableOnLevel(this.state.currentLevel, x, y) : isBuildable(x,y);
  if(!buildable){ UI.float(this, x,y,'Not on loaf path!',true); return; }
    const type=this.state.placing; if(!type) return;
  if(this.state.coins<type.cost){ UI.float(this,x,y,'Not enough coins',true); return; }
  for(const t of this.state.toasters){ if(Math.hypot(x-t.x,y-t.y)<36){ UI.float(this,x,y,'Too close to another toaster',true); return; } }
    const inst=this.makeToaster(type,x,y);
    // Calculate initial projectile stats
    this.updateTowerProjectileStats(inst);
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
      // Radiation system for microwave towers
      radiationCapacity:type.base.radiationCapacity||null,
      radiationCurrent:type.base.radiationCapacity||null, // Start at full capacity
      radiationRegenRate:type.base.radiationRegenRate||null,
      reloadTime:type.base.reloadTime||null,
      isReloading:false,
      reloadProgress:0,
      lastRadiationRegen:Date.now(),
      // Missile launcher slot system
      missileSlots:type.base.missileSlots||null,
      slotCooldowns:type.base.slotCooldowns ? [...type.base.slotCooldowns] : null,
      slotAmmoTypes:null, // Will be initialized when multiWarhead is unlocked
      currentSlot:0, // Which slot fires next
      arcingFire:type.base.arcingFire||false,
      indirectFire:type.base.indirectFire||false,
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
  this.state.selected=null; UI.updateInspect(this); UI.refreshCatalog(this); UI.hideTowerPopup();
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
  
  // Calculate and cache projectile lifetime for a tower
  updateTowerProjectileStats(tower) {
    const speed = tower.projectileSpeed || 300; // Default speed if not set
    // Skip caching if tower has unlimited range upgrade
    if (!tower.unlimitedRange) {
      tower._projectileLifetime = tower.range / speed;
    } else {
      // For unlimited range towers, use a very high lifetime
      tower._projectileLifetime = 10; // 10 seconds should be enough for any map
    }
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
    
    // Recalculate projectile lifetime after stats change
    this.updateTowerProjectileStats(tower);
    
    UI.float(this, tower.x, tower.y, `${upgrade.name}!`);
    UI.sync(this);
    UI.updateInspect(this);
    UI.refreshCatalog(this);
    
    return true;
  }
  getSelected(){ return this.state.toasters.find(t=>t.id===this.state.selected); }
  startWave(){
    if(this.state.waveInProgress) return; 
    this.state.wave++; 
    UI.sync(this); 
    UI.log(`Wave ${this.state.wave} begins!`);
    
    const level = this.state.currentLevel;
    let waveData;
    
    // Ensure we always get valid wave data
    try {
      if (this.state.wave % 10 === 0) {
        waveData = buildBossWave(this.state.wave, level);
      } else {
        waveData = buildWave(this.state.wave, level);
      }
      
      // Validate that we got valid wave data
      if (!waveData || !Array.isArray(waveData) || waveData.length === 0) {
        console.error(`Failed to generate wave data for wave ${this.state.wave}`);
        // Fallback - generate a basic wave manually
        waveData = [{type:'slice', hp:20+4*this.state.wave, speed:70+1.5*this.state.wave, bounty:4}];
      }
      
      this.state.waveQueue = waveData;
    } catch (error) {
      console.error(`Error generating wave ${this.state.wave}:`, error);
      // Emergency fallback
      this.state.waveQueue = [{type:'slice', hp:20+4*this.state.wave, speed:70+1.5*this.state.wave, bounty:4}];
    }
    
    this.state.spawnTimer=0; 
    this.state.betweenWaves=false; 
    this.state.waveInProgress=true; 
    this.state.running=true;
    // Reset auto-wave timer to prevent accidental immediate restart
    this.state.autoWaveTimer = 0;
  }
  update(dt){
    // spawn
    if(this.state.waveInProgress){
      this.state.spawnTimer-=dt;
        if(this.state.spawnTimer<=0 && this.state.waveQueue.length){ 
          const nextSpec = this.state.waveQueue.shift();
          spawnBread(nextSpec, this.state); 
          this.state.spawnTimer=0.45; 
        }
      if(!this.state.waveQueue.length && breads.every(b=>!b.alive)){
  this.state.waveInProgress=false; this.state.betweenWaves=true;
  this.state.ap+=1; this.state.coins+=50+this.state.wave*10; UI.sync(this);
  UI.log(`Wave ${this.state.wave} cleared! +AP, +coins`);
        // Start 3-second countdown for next wave
        this.state.autoWaveTimer = 3;
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
        
        // Handle missile launcher slot cooldowns
        if(t.missileSlots && t.slotCooldowns) {
          for(let i = 0; i < t.slotCooldowns.length; i++) {
            t.slotCooldowns[i] -= dt;
            if(t.slotCooldowns[i] < 0) t.slotCooldowns[i] = 0;
          }
        }
        
        // Handle radiation system for microwave towers
        if(t.radiationCapacity !== null && t.reloadTime !== null) {
          if(t.isReloading) {
            // Tower is reloading
            t.reloadProgress += dt;
            if(t.reloadProgress >= t.reloadTime) {
              // Reload complete
              t.radiationCurrent = t.radiationCapacity;
              t.isReloading = false;
              t.reloadProgress = 0;
            }
          }
        }
        
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
        
        // Handle missile launcher firing (independent slot system)
        if(t.missileSlots && t.slotCooldowns) {
          // Collect all ready slots first
          const readySlots = [];
          for(let slotIndex = 0; slotIndex < t.slotCooldowns.length; slotIndex++) {
            if(t.slotCooldowns[slotIndex] === 0) {
              readySlots.push(slotIndex);
            }
          }
          if(readySlots.length === 0) continue; // No slots ready to fire

          // Build list of enemies in range, prioritized closest-to-exit then proximity
          const enemiesInRange = breads
            .filter(e => e.alive && Math.hypot(e.x - t.x, e.y - t.y) <= t.range)
            .map(e => ({
              enemy: e,
              score: (1000 - e.wpt * 50) + Math.hypot(e.x - t.x, e.y - t.y) * 0.1
            }))
            .sort((a,b)=>a.score-b.score)
            .map(x=>x.enemy);
          if(enemiesInRange.length === 0) continue;

          // Helper: predict enemy position along its path after timeAhead seconds
          const predictOnPath = (enemy, timeAhead) => {
            // Determine path waypoints
            let wpArray = waypoints; // legacy fallback
            if (this.state.currentLevel) {
              const p = this.state.currentLevel.paths.find(p=>p.id===enemy.pathId) || this.state.currentLevel.paths[0];
              wpArray = p.waypoints;
            }
            // Remaining distance the enemy will travel
            let remaining = Math.max(0, (enemy.speed || 0) * timeAhead);
            // Start from current position toward next waypoint
            let cx = enemy.x, cy = enemy.y;
            let idx = enemy.wpt + 1;
            while(remaining > 0 && idx < wpArray.length) {
              const tx = wpArray[idx].x, ty = wpArray[idx].y;
              const dx = tx - cx, dy = ty - cy; const seg = Math.hypot(dx,dy);
              if(seg <= 0.0001) { idx++; continue; }
              if(remaining >= seg) { // move to waypoint and continue
                cx = tx; cy = ty; idx++; remaining -= seg;
              } else {
                const f = remaining / seg; cx += dx * f; cy += dy * f; remaining = 0;
              }
            }
            return { x: cx, y: cy };
          };

          // Helper: project any point to the closest point on the enemy's path polyline
          const projectToPath = (enemy, pt) => {
            // Determine path waypoints
            let wpArray = waypoints; // legacy fallback
            if (this.state.currentLevel) {
              const p = this.state.currentLevel.paths.find(p=>p.id===enemy.pathId) || this.state.currentLevel.paths[0];
              wpArray = p.waypoints;
            }
            let bestX = pt.x, bestY = pt.y, bestD2 = Infinity;
            // Search from current segment onwards to save work
            const startIdx = Math.max(0, (enemy.wpt || 0));
            for(let i = startIdx; i < wpArray.length - 1; i++) {
              const ax = wpArray[i].x, ay = wpArray[i].y;
              const bx = wpArray[i+1].x, by = wpArray[i+1].y;
              const abx = bx - ax, aby = by - ay;
              const apx = pt.x - ax, apy = pt.y - ay;
              const ab2 = abx*abx + aby*aby;
              if(ab2 <= 1e-6) continue;
              let tproj = (apx*abx + apy*aby) / ab2;
              tproj = Math.max(0, Math.min(1, tproj));
              const px = ax + abx * tproj;
              const py = ay + aby * tproj;
              const dx = px - pt.x, dy = py - pt.y;
              const d2 = dx*dx + dy*dy;
              if(d2 < bestD2) { bestD2 = d2; bestX = px; bestY = py; }
            }
            return { x: bestX, y: bestY };
          };

          // Fire missiles from ready slots with path-constrained predicted targeting
          let missilesFired = 0;
          for (let i = 0; i < readySlots.length; i++) {
            const slotIndex = readySlots[i];
            // Choose target enemy (rotate through list)
            const enemy = enemiesInRange[i % enemiesInRange.length];
            if(!enemy) continue;

            // Estimate flight time based on distance and missile speed
            const baseSpeed = t.projectileSpeed || 180;
            const distNow = Math.hypot(enemy.x - t.x, enemy.y - t.y);
            // Slightly longer than straight-line to account for arc
            const timeAhead = Math.min(3, Math.max(0.5, (distNow / baseSpeed) * 1.2));
            // Predict position along path
            let aim = predictOnPath(enemy, t.leadTargeting ? timeAhead : 0.2);
            // Project aim onto the enemy path to ensure on-path impacts
            aim = projectToPath(enemy, aim);
            // Clamp aim to tower range (stay within circle)
            const aimDist = Math.hypot(aim.x - t.x, aim.y - t.y);
            if(aimDist > t.range) {
              const ang = Math.atan2(aim.y - t.y, aim.x - t.x);
              aim = { x: t.x + Math.cos(ang) * (t.range - 5), y: t.y + Math.sin(ang) * (t.range - 5) };
            }

            // Prepare projectile configuration and damage based on ammo type
            const slotFireRate = t.fireRate;
            let actualDamage = t.damage;
            let ammoType = 'standard';
            if(t.multiWarhead && t.customAmmoPerSlot && t.slotAmmoTypes) {
              ammoType = t.slotAmmoTypes[slotIndex] || 'standard';
            }
            switch(ammoType) {
              case 'high_explosive': actualDamage *= 1.3; break;
              case 'armor_piercing': actualDamage *= 1.1; break;
              case 'cluster': actualDamage *= 0.8; break; // Main warhead less dmg
              case 'thermobaric': actualDamage *= 1.5; break;
              case 'nuclear': actualDamage *= 2.5; break;
            }

            const tempTower = { ...t };
            tempTower.currentAmmoType = ammoType;
            tempTower.slotIndex = slotIndex;
            if(t.multiWarhead && ammoType !== 'standard') {
              switch(ammoType) {
                case 'high_explosive':
                  tempTower.splash = (t.splash || 40) * 1.5;
                  tempTower.splashDmg = (t.splashDmg || 25) * 1.3;
                  break;
                case 'armor_piercing':
                  tempTower.armorPiercing = (t.armorPiercing || 0) + 5;
                  tempTower.penetratesShields = true;
                  break;
                case 'cluster':
                  tempTower.clusterBombs = true;
                  tempTower.submunitions = 4;
                  tempTower.submunitionDamage = actualDamage * 0.6;
                  break;
                case 'thermobaric':
                  tempTower.splash = (t.splash || 40) * 2;
                  tempTower.splashDmg = (t.splashDmg || 25) * 1.8;
                  tempTower.fireDamage = actualDamage * 0.3;
                  tempTower.burnDuration = 4;
                  break;
                case 'nuclear':
                  tempTower.splash = (t.splash || 40) * 3;
                  tempTower.splashDmg = (t.splashDmg || 25) * 2.5;
                  tempTower.radiationDamage = actualDamage * 0.5;
                  tempTower.radiationRadius = (tempTower.splash || 60) * 1.5;
                  break;
              }
            }

            // Fire missile with path-based predicted impact point; include timeToTarget hint
            fireFrom(
              tempTower,
              { x: aim.x, y: aim.y, alive: true, timeToTarget: timeAhead },
              actualDamage
            );
            t.slotCooldowns[slotIndex] = 1 / slotFireRate;

            const ammoIcon = {
              'standard': '🚀', 'high_explosive': '💥', 'armor_piercing': '🔹',
              'cluster': '🎆', 'thermobaric': '🔥', 'nuclear': '☢️'
            }[ammoType] || '🚀';
            UI.float(this, t.x, t.y, `${ammoIcon} Slot ${slotIndex + 1} → Path`, false);

            missilesFired++;
          }
        }
        
        if(!suppressNormalShot && target && t.cooldown === 0 && !t.missileSlots){ 
          // Check radiation capacity for microwave towers
          const energyRequired = t.energyPerShot || 1;
          if(t.radiationCapacity !== null) {
            if(t.isReloading) {
              // Tower is currently reloading, cannot shoot
              continue;
            }
            if(t.radiationCurrent < energyRequired) {
              // Not enough energy to shoot, start reloading
              if(!t.isReloading) {
                t.isReloading = true;
                t.reloadProgress = 0;
              }
              continue;
            }
          }
          
          // Calculate actual damage with critical hits
          let actualDamage = t._tempDamage || t.damage;
          
          // Gamma Burst upgrade: first shot after full recharge does extra damage
          let isGammaBurst = false;
          if(t.gammaBurst && t.radiationCurrent === t.radiationCapacity) {
            actualDamage *= t.gammaMultiplier || 3.0;
            isGammaBurst = true;
            UI.float(this, target.x, target.y, 'GAMMA BURST!', false);
          }
          
          let wasCrit = false;
          if(t.critChance && Math.random() < t.critChance) {
            actualDamage *= (t.critMultiplier || 2.0);
            wasCrit = true;
            UI.float(this, target.x, target.y, 'CRIT!', false);
            
            // Crit explosions upgrade
            if(t.critExplosions && wasCrit) {
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
            // Add muzzle flash and special effects for microwave towers
            const angle = Math.atan2(target.y - t.y, target.x - t.x);
            
            if(t.type === 'microwave') {
              // Custom microwave beam effect instead of regular muzzle flash
              import('../systems/particles').then(({spawnMicrowaveBeam}) => {
                if(spawnMicrowaveBeam) {
                  spawnMicrowaveBeam(t.x, t.y, target.x, target.y, t.projectileSpeed || 300);
                }
              }).catch(() => {});
            } else {
              spawnMuzzleFlash(t.x, t.y, angle);
            }
            
            // Apply inaccuracy for airfryer towers
            let finalTarget = target;
            if(t.type === 'airfryer') {
              const baseAngle = Math.atan2(target.y - t.y, target.x - t.x);
              // Base inaccuracy reduced by precision jets upgrade
              // 0.15 radians ≈ 8.6 degrees, 0.08 radians ≈ 4.6 degrees (vs tornado upgrade's 0.9 radians ≈ 51.6 degrees)
              const inaccuracy = t.precisionJets ? 0.08 : 0.15; 
              const offset = (Math.random() - 0.5) * inaccuracy;
              const distance = Math.hypot(target.x - t.x, target.y - t.y);
              
              finalTarget = {
                x: t.x + Math.cos(baseAngle + offset) * distance,
                y: t.y + Math.sin(baseAngle + offset) * distance
              };
            }
            
            fireFrom(t, finalTarget, actualDamage); 
            
            // Chain lightning for Gamma Burst
            if(isGammaBurst && t.chainLightning) {
              // Mark the projectile for chain lightning processing
              const projectileId = projectiles[projectiles.length - 1]?.id;
              if(projectileId) {
                const proj = projectiles[projectiles.length - 1];
                proj.chainLightning = true;
                proj.chainCount = t.chainCount || 8;
                proj.chainStunDuration = t.chainStunDuration || 2.0;
                proj.chainDamage = actualDamage;
                proj.chainHitEnemies = []; // Track which enemies have been hit by the chain
              }
            }
            
            // Dualwave Mode - Independent targeting
            if(t.dualWave && t.independentTargeting) {
              // Find a second target different from the first
              let secondTarget = null;
              let bestScore = Infinity;
              for(const e of breads) {
                if(!e.alive || e === target) continue;
                const d = Math.hypot(e.x - t.x, e.y - t.y);
                if(d <= t.range) {
                  const score = (1000 - e.wpt * 50) + d * 0.1;
                  if(score < bestScore) {
                    bestScore = score;
                    secondTarget = e;
                  }
                }
              }
              
              if(secondTarget) {
                const angle2 = Math.atan2(secondTarget.y - t.y, secondTarget.x - t.x);
                
                // Custom effect for microwave towers
                if(t.type === 'microwave') {
                  import('../systems/particles').then(({spawnMicrowaveBeam}) => {
                    if(spawnMicrowaveBeam) {
                      spawnMicrowaveBeam(t.x, t.y, secondTarget.x, secondTarget.y, t.projectileSpeed || 300);
                    }
                  }).catch(() => {});
                } else {
                  spawnMuzzleFlash(t.x, t.y, angle2);
                }
                
                // Apply inaccuracy for airfryer towers (same logic as first shot)
                let finalSecondTarget = secondTarget;
                if(t.type === 'airfryer') {
                  const baseAngle = Math.atan2(secondTarget.y - t.y, secondTarget.x - t.x);
                  const inaccuracy = t.precisionJets ? 0.08 : 0.15; // Precision jets reduces inaccuracy
                  const offset = (Math.random() - 0.5) * inaccuracy;
                  const distance = Math.hypot(secondTarget.x - t.x, secondTarget.y - t.y);
                  
                  finalSecondTarget = {
                    x: t.x + Math.cos(baseAngle + offset) * distance,
                    y: t.y + Math.sin(baseAngle + offset) * distance
                  };
                }
                
                fireFrom(t, finalSecondTarget, actualDamage);
                
                // Apply chain lightning to second projectile too if it's a gamma burst
                if(isGammaBurst && t.chainLightning) {
                  const projectileId2 = projectiles[projectiles.length - 1]?.id;
                  if(projectileId2) {
                    const proj2 = projectiles[projectiles.length - 1];
                    proj2.chainLightning = true;
                    proj2.chainCount = t.chainCount || 8;
                    proj2.chainStunDuration = t.chainStunDuration || 2.0;
                    proj2.chainDamage = actualDamage;
                    proj2.chainHitEnemies = []; // Track which enemies have been hit by the chain
                  }
                }
              }
            }
            
            // Double shot upgrade
            if(t.doubleShot && Math.random() < t.doubleShot) {
              // Small delay for second shot
              setTimeout(() => {
                if(target.alive) {
                  // Apply inaccuracy for airfryer towers (same logic as main shot)
                  let finalDoubleTarget = target;
                  if(t.type === 'airfryer') {
                    const baseAngle = Math.atan2(target.y - t.y, target.x - t.x);
                    const inaccuracy = t.precisionJets ? 0.08 : 0.15; // Precision jets reduces inaccuracy
                    const offset = (Math.random() - 0.5) * inaccuracy;
                    const distance = Math.hypot(target.x - t.x, target.y - t.y);
                    
                    finalDoubleTarget = {
                      x: t.x + Math.cos(baseAngle + offset) * distance,
                      y: t.y + Math.sin(baseAngle + offset) * distance
                    };
                  }
                  
                  fireFrom(t, finalDoubleTarget, actualDamage * 0.8);
                  spawnMuzzleFlash(t.x, t.y, angle);
                }
              }, 50);
            }
          }
          
          const effectiveFireRate = t._tempFireRate || t.fireRate;
          t.cooldown = Math.max(0.02, 1/effectiveFireRate); 
          
          // Consume radiation energy for microwave towers
          if(t.radiationCapacity !== null) {
            if(t.drainsAllAmmo) {
              t.radiationCurrent = 0; // Radiation Lance drains all ammo
            } else {
              t.radiationCurrent -= energyRequired;
            }
            
            // Start reloading if energy is depleted
            if(t.radiationCurrent <= 0) {
              t.radiationCurrent = 0;
              t.isReloading = true;
              t.reloadProgress = 0;
            }
          } 
        }
      } // End of for(const t of this.state.toasters) loop
    } // End of if(this.state.running) block
    stepProjectiles(dt, this.state);
    stepParticles(dt);
    stepEffects(dt, this.state);
    stepPowerups(dt, this.state);
    stepAbilities(dt);
    stepStats(dt); // Track playtime and other stats
    
    // Ensure UI is synced (especially for lives changes from enemy damage)
    if (this.state.running && Math.random() < 0.1) { // Sync ~10% of frames to avoid performance issues
      UI.sync(this);
    }
    
    // Simple auto-wave progression - start next wave after 3 seconds
    if (this.state.betweenWaves && this.state.autoWaveTimer > 0) {
      this.state.autoWaveTimer -= dt;
      if (this.state.autoWaveTimer <= 0) {
        this.startWave();
      }
    }
  }
  draw(){ drawScene(this.ctx, this.state, this); }

  static cleanupGlobals(){
    try { require('../content/entities/breads/breads').breads.length=0; } catch {}
    try { require('../systems/projectiles/projectiles').projectiles.length=0; } catch {}
    try { const m=require('../systems/particles/particles'); m.particles.length=0; m.damageNumbers.length=0; } catch {}
    try { require('../systems/effects/effects').heatZones.length=0; } catch {}
    try { const m=require('../systems/powerups/powerups'); m.powerups.length=0; m.activePowerups.length=0; } catch {}
  }
}
