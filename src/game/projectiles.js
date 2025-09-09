// @ts-nocheck
import { breads, damageBread } from "./breads";
export const projectiles = [];
export function fireFrom(t, target) {
    const angle = Math.atan2(target.y - t.y, target.x - t.x);
    const speed = t.projectileSpeed;
    const p = { id: ++_id, x: t.x, y: t.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, dmg: t.damage, pierce: (t.pierce || 0), splash: t.splash || 0, splashDmg: t.splashDmg || 0, life: 2 };
    projectiles.push(p);
}
export function stepProjectiles(dt, state) {
    for (const p of projectiles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life <= 0)
            p.dead = true;
        for (const e of breads) {
            if (!e.alive)
                continue;
            if (Math.hypot(p.x - e.x, p.y - e.y) <= e.r) {
                damageBread(e, p.dmg, state);
                if (p.splash > 0) {
                    for (const e2 of breads) {
                        if (!e2.alive)
                            continue;
                        const d = Math.hypot(p.x - e2.x, p.y - e2.y);
                        if (d <= p.splash && e2 !== e) {
                            damageBread(e2, p.splashDmg, state);
                        }
                    }
                }
                if (p.pierce > 0)
                    p.pierce--;
                else {
                    p.dead = true;
                    break;
                }
            }
        }
    }
    for (let i = projectiles.length - 1; i >= 0; i--)
        if (projectiles[i].dead)
            projectiles.splice(i, 1);
}
let _id = 0;
