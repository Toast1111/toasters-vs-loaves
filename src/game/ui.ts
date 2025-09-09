// @ts-nocheck
import { TOWER_TYPES } from "./towers";

export const UI={
  bind(game){
    document.getElementById('sellBtn').onclick=()=>game.sellSelected();
    document.getElementById('rangeToggle').onchange=(e)=>{ game.state.showRanges=e.target.checked; };
    document.getElementById('startBtn').onclick=()=>{ if(game.state.betweenWaves) game.startWave(); };
    this.refreshCatalog(game);
    this.refreshTech(game);
    this.refreshAbilities();
    this.refreshAchievements();
    this.sync(game);
  },
  log(msg){ const el=document.getElementById('log'); const atBottom = el.scrollTop+el.clientHeight>=el.scrollHeight-4; el.insertAdjacentHTML('beforeend',`<div>• ${msg}</div>`); if(atBottom) el.scrollTop=el.scrollHeight; },
  sync(game){ 
    document.getElementById('coins').textContent=game.state.coins; 
    document.getElementById('lives').textContent=game.state.lives; 
    document.getElementById('wave').textContent=game.state.wave; 
    document.getElementById('ap').textContent=game.state.ap; 
    this.updatePowerupDisplay();
  },
  refreshCatalog(game){
    const catalogEl=document.getElementById('catalog'); catalogEl.innerHTML='';
    for(const t of TOWER_TYPES){
      const card=document.createElement('div'); card.className='card';
      card.innerHTML=`<div class="row"><b>${t.name}</b><span class="badge">${t.cost}c</span></div>
        <div class="small">${t.desc}</div>
        <button class="placeBtn btn">Place</button>`;
      card.querySelector('.placeBtn').onclick=()=>{
        if(game.state.coins < t.cost){ this.log(`Need ${t.cost}c for ${t.name}.`); return; }
        game.state.placing=t;
      };
      catalogEl.appendChild(card);
    }
  },
  refreshTech(game){
    const techEl=document.getElementById('tech'); techEl.innerHTML='';
    for(const t of TECHS){
      const node=document.createElement('div'); node.className='tech';
      node.innerHTML=`<b>${t.name}</b><div class="small">${t.desc}</div>
      <button class="buy btn small">${`Buy (${t.cost} AP)`}</button>`;
      node.querySelector('.buy').onclick=()=>{
        if(game.state.ap<t.cost){ this.log('Not enough AP. Survive more waves!'); return; }
        game.state.ap-=t.cost; this.sync(game); t.action(game); this.log(`Tech unlocked: ${t.name}`);
        this.refreshTech(game); this.updateInspect(game);
      };
      techEl.appendChild(node);
    }
  },
  updateInspect(game){
    const sec=document.getElementById('inspectSection'); const box=document.getElementById('inspect');
    const t=game.getSelected();
    if(!t){ sec.style.display='none'; box.innerHTML=''; return; }
    sec.style.display='block';
    const base=getTowerBase(t.type);
    const canUpgrade = t.level < base.upgrades.length;
    const up = canUpgrade ? base.upgrades[t.level] : null;
    box.innerHTML=`
      <div class="row"><b>${t.name}</b><span class="small">ID ${t.id}</span></div>
      <div class="keyline"></div>
      <div class="small">Range: ${t.range.toFixed(0)} | Dmg: ${t.damage.toFixed(0)} | Fire/s: ${t.fireRate.toFixed(2)}${t.pierce?` | Pierce: ${t.pierce}`:''}${t.splash?` | Splash: ${t.splash}`:''}</div>
      <div class="keyline"></div>
      ${canUpgrade?`
        <div class="row"><div>Next: <b>${up.name}</b><div class="small">${up.tip}</div></div>
        <button id="upgradeBtn" class="btn small" ${game.state.coins<up.cost?'disabled':''}>Upgrade (${up.cost}c)</button></div>
      `:`<div class="small">Maxed out. Shines like new chrome.</div>`}
    `;
    if(canUpgrade){
      document.getElementById('upgradeBtn').onclick=()=>{
        if(game.state.coins<up.cost) return; game.state.coins-=up.cost; this.sync(game);
        up.effect(t); t.level++; this.float(game,t.x,t.y,'Upgrade!'); this.updateInspect(game); this.refreshCatalog(game);
      };
    }
  },
  float(game,x,y,str,isBad=false){ game.state.texts.push({x,y,str,isBad,t:0}); },
  updatePowerupDisplay(){
    import('./powerups').then(({ activePowerups, POWERUP_TYPES }) => {
      const display = document.getElementById('powerupDisplay');
      const content = document.getElementById('activePowerups');
      
      if (activePowerups.length === 0) {
        display.style.display = 'none';
      } else {
        display.style.display = 'block';
        const powerupTexts = activePowerups.map(p => {
          const data = POWERUP_TYPES[p.type];
          return `<span style="color: ${data.color}">${data.name} (${Math.ceil(p.duration)}s)</span>`;
        });
        content.innerHTML = powerupTexts.join(', ');
      }
    });
  },
  refreshAbilities(){
    import('./abilities').then(({ getAbilityStatus }) => {
      const display = document.getElementById('abilitiesDisplay');
      const abilities = getAbilityStatus();
      
      let html = '<div class="hint">Hotkeys: Q, W, E, R. Abilities cost coins except Emergency Coins.</div>';
      
      for (const ability of abilities) {
        const readyClass = ability.ready ? 'ready' : 'cooldown';
        const cooldownPercent = ability.ready ? 0 : (ability.cooldown / ability.maxCooldown) * 100;
        
        html += `
          <div class="ability ${readyClass}">
            <div class="ability-info">
              <div><strong>${ability.name}</strong> ${ability.cost > 0 ? `(${ability.cost}c)` : '(Free)'}</div>
              <div class="small">${ability.description}</div>
              ${!ability.ready ? `<div class="cooldown-bar"><div class="cooldown-progress" style="width: ${cooldownPercent}%"></div></div>` : ''}
            </div>
            <div class="ability-key">${ability.hotkey}</div>
          </div>
        `;
      }
      
      display.innerHTML = html;
    });
  },
  refreshAchievements(){
    import('./achievements').then(({ achievements, getAchievementProgress }) => {
      const display = document.getElementById('achievementsDisplay');
      const progress = getAchievementProgress();
      
      let html = `<div class="hint">Achievements: ${progress.unlocked}/${progress.total} (${progress.percentage}%)</div>`;
      
      for (const achievement of achievements) {
        const statusClass = achievement.unlocked ? 'unlocked' : 'locked';
        html += `
          <div class="achievement ${statusClass}">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
              <div class="achievement-name">${achievement.name}</div>
              <div class="achievement-desc">${achievement.description}</div>
            </div>
          </div>
        `;
      }
      
      display.innerHTML = html;
    });
  }
};

// deps referenced inside UI
import { TECHS } from "./tech";
import { getTowerBase } from "./towers";
