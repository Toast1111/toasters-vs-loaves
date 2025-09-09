// @ts-nocheck
import { waypoints } from "./map";
import { addScreenShake } from "./effects";
import { UI } from "./ui";
import { rollPowerupDrop } from "./powerups";
import { spawnExplosion, spawnDamageNumber } from "./particles";
import { recordEnemyKilled, recordCoinsEarned } from "./achievements";
export const breads = [];
export function spawnBread(spec) {
    const size = spec.size === 'large' ? 20 : 12;
    const e = {
        id: ++_id, type: spec.type, hp: spec.hp, maxHp: spec.hp, speed: spec.speed,
        bounty: spec.bounty, wpt: 0, x: waypoints[0].x, y: waypoints[0].y, r: size,
        alive: true, special: spec.special || null, armor: spec.armor || 0,
        lastSpeedBurst: 0, regenerateTimer: 0
    };
    breads.push(e);
}
export function stepBreads(dt, state) {
    // Apply freeze time effect
    const effectiveDt = state._freezeActive ? dt * 0.1 : dt;
    for (const e of breads) {
        if (!e.alive)
            continue;
        // Handle special abilities
        if (e.special === 'regenerate') {
            e.regenerateTimer += effectiveDt;
            if (e.regenerateTimer >= 2 && e.hp < e.maxHp) {
                e.hp = Math.min(e.maxHp, e.hp + e.maxHp * 0.1);
                e.regenerateTimer = 0;
            }
        }
        let currentSpeed = e.speed;
        if (e.special === 'speed_burst') {
            e.lastSpeedBurst += effectiveDt;
            if (e.lastSpeedBurst >= 4) {
                currentSpeed = e.speed * 2.5; // Speed burst!
                e.lastSpeedBurst = -1; // Burst for 1 second
            }
            else if (e.lastSpeedBurst < 0) {
                currentSpeed = e.speed * 2.5;
                e.lastSpeedBurst += effectiveDt;
                if (e.lastSpeedBurst >= 0)
                    e.lastSpeedBurst = 0;
            }
        }
        const target = waypoints[e.wpt + 1];
        if (!target) {
            e.alive = false;
            // Bosses cause extra damage when they reach the end
            if (!state._invulnerable) {
                const damage = e.r > 15 ? 5 : 1;
                state.lives -= damage;
                document.getElementById('lives').textContent = state.lives;
                if (state.lives <= 0) {
                    state.running = false;
                }
            }
            continue;
        }
        const dx = target.x - e.x, dy = target.y - e.y;
        const d = Math.hypot(dx, dy);
        if (d < 2) {
            e.wpt++;
            continue;
        }
        const vx = dx / d * currentSpeed, vy = dy / d * currentSpeed;
        e.x += vx * effectiveDt;
        e.y += vy * effectiveDt;
    }
}
export function damageBread(e, dmg, state) {
    // Apply armor reduction
    const actualDamage = dmg * (1 - (e.armor || 0));
    e.hp -= actualDamage;
    // Show damage number
    const isCrit = actualDamage > e.maxHp * 0.3;
    spawnDamageNumber(e.x, e.y - 10, actualDamage, isCrit);
    if (e.hp <= 0) {
        e.alive = false;
        // Record kill for achievements
        recordEnemyKilled(e);
        // Death explosion
        spawnExplosion(e.x, e.y, e.r > 15 ? 20 : 8);
        // Roll for powerup drop
        rollPowerupDrop(e, state);
        // Handle splitting boss
        if (e.special === 'split' && e.r > 15) {
            // Split into 3 smaller versions
            for (let i = 0; i < 3; i++) {
                const angle = (i * Math.PI * 2 / 3) + Math.random() * 0.5;
                const splitBread = {
                    id: ++_id, type: 'sourdough_split', hp: e.maxHp * 0.3, maxHp: e.maxHp * 0.3,
                    speed: e.speed * 1.2, bounty: Math.floor(e.bounty * 0.3), wpt: e.wpt,
                    x: e.x + Math.cos(angle) * 25, y: e.y + Math.sin(angle) * 25,
                    r: 8, alive: true, special: null, armor: 0,
                    lastSpeedBurst: 0, regenerateTimer: 0
                };
                breads.push(splitBread);
            }
        }
        const bonus = Math.round(e.bounty * state.global.bounty);
        state.coins += bonus;
        recordCoinsEarned(bonus); // Record for achievements
        document.getElementById('coins').textContent = state.coins;
        // Extra effects for boss kills
        if (e.r > 15) {
            // Add screen shake and bonus AP for boss kills
            state.ap += 2;
            addScreenShake(8, 0.5);
            UI.log(`💀 Boss defeated! +2 AP bonus!`);
        }
    }
}
let _id = 0;
