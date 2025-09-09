// @ts-nocheck
import { UI } from "./ui";
import { createInitialState } from "./state";
import { drawScene } from "./render";
import { buildWave } from "./waves";
import { isBuildable, waypoints } from "./map";
import { fireFrom, projectiles, stepProjectiles } from "./projectiles";
import { spawnCrumbs, particles, stepParticles } from "./particles";
import { TOWER_TYPES, getTowerBase } from "./towers";
import { damageBread, spawnBread, breads, stepBreads } from "./breads";

export class Game{
  canvas; ctx; state; mouse={x:-999,y:-999}; last=performance.now();
  constructor(canvas, ctx){ this.canvas=canvas; this.ctx=ctx; this.state=createInitialState(canvas.width, canvas.height); }
  init(){
    UI.bind(this);
    this.canvas.addEventListener('mousemove',e=>{ this.mouse.x=e.offsetX; this.mouse.y=e.offsetY; });
    this.canvas.addEventListener('mouseleave',()=>{ this.mouse.x=this.mouse.y=-9999; });
    this.canvas.addEventListener('click', e=>{
      const x=e.offsetX, y=e.offsetY;
      const hit=this.state.toasters.findLast(t=>Math.hypot(x-t.x,y-t.y)<=18);
      if(hit){ this.state.selected=hit.id; UI.updateInspect(this); return; }
      if(this.state.placing){ this.tryPlaceTower(x,y, e.shiftKey); }
    });
    UI.refreshCatalog(this);
    UI.refreshTech(this);
    UI.log('Welcome to Toasters vs Loaves! Place toasters and press Start Wave. Earn AP to buy Tech.');
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
      level:0, path:0, cooldown:0, sold:false};
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
  getTowerCost(t){ const base=getTowerBase(t.type).cost; let spent=0; const ups=getTowerBase(t.type).upgrades; for(let i=0;i<t.level;i++) spent+=ups[i].cost; return base+spent; }
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
      }
    }
    // enemies
    stepBreads(dt, this.state);
    // towers
    if(this.state.running){
      for(const t of this.state.toasters){
        t.cooldown-=dt; if(t.cooldown<0) t.cooldown=0;
        // target closest-to-exit in range
        let target=null, best=Infinity;
        for(const e of breads){ if(!e.alive) continue; const d=Math.hypot(e.x-t.x,e.y-t.y); if(d<=t.range){
          const score=(1000-e.wpt*50)+d*0.1; if(score<best){ best=score; target=e; }
        }}
        if(target && t.cooldown===0){ fireFrom(t,target); t.cooldown=Math.max(0.02, 1/t.fireRate); }
      }
    }
    stepProjectiles(dt, this.state);
    stepParticles(dt);
  }
  draw(){ drawScene(this.ctx, this.state); }
}
