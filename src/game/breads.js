// @ts-nocheck
import { waypoints } from "./map";
export const breads = [];
export function spawnBread(spec) { const e = { id: ++_id, type: spec.type, hp: spec.hp, maxHp: spec.hp, speed: spec.speed, bounty: spec.bounty, wpt: 0, x: waypoints[0].x, y: waypoints[0].y, r: 12, alive: true }; breads.push(e); }
export function stepBreads(dt, state) {
    for (const e of breads) {
        if (!e.alive)
            continue;
        const target = waypoints[e.wpt + 1];
        if (!target) {
            e.alive = false;
            state.lives -= 1;
            document.getElementById('lives').textContent = state.lives;
            if (state.lives <= 0) {
                state.running = false;
            }
            continue;
        }
        const dx = target.x - e.x, dy = target.y - e.y;
        const d = Math.hypot(dx, dy);
        if (d < 2) {
            e.wpt++;
            continue;
        }
        const vx = dx / d * e.speed, vy = dy / d * e.speed;
        e.x += vx * dt;
        e.y += vy * dt;
    }
}
export function damageBread(e, dmg, state) {
    e.hp -= dmg;
    if (e.hp <= 0) {
        e.alive = false;
        const bonus = Math.round(e.bounty * state.global.bounty);
        state.coins += bonus;
        document.getElementById('coins').textContent = state.coins;
    }
}
let _id = 0;
