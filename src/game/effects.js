// @ts-nocheck
export const heatZones = [];
export const screenShake = { intensity: 0, duration: 0 };
export function createHeatZone(x, y, radius = 50, damage = 5, duration = 3) {
    heatZones.push({
        x, y, radius, damage, duration, maxDuration: duration,
        id: ++_heatZoneId
    });
}
export function stepEffects(dt, state) {
    // Update heat zones
    for (const zone of heatZones) {
        zone.duration -= dt;
        if (zone.duration <= 0) {
            zone.dead = true;
            continue;
        }
        // Damage and slow breads in zone
        for (const bread of state.breads || []) {
            if (!bread.alive)
                continue;
            const dist = Math.hypot(bread.x - zone.x, bread.y - zone.y);
            if (dist <= zone.radius) {
                bread.hp -= zone.damage * dt;
                bread.speed *= 0.7; // Slow effect
                if (bread.hp <= 0) {
                    bread.alive = false;
                    const bonus = Math.round(bread.bounty * state.global.bounty);
                    state.coins += bonus;
                }
            }
        }
    }
    // Clean up dead zones
    for (let i = heatZones.length - 1; i >= 0; i--) {
        if (heatZones[i].dead)
            heatZones.splice(i, 1);
    }
    // Update screen shake
    if (screenShake.duration > 0) {
        screenShake.duration -= dt;
        screenShake.intensity *= 0.9;
    }
}
export function addScreenShake(intensity = 5, duration = 0.3) {
    screenShake.intensity = intensity;
    screenShake.duration = duration;
}
export function getAdaptiveTargeting(tower, enemies) {
    if (!enemies.length)
        return null;
    // Count enemy types and densities
    const strongEnemies = enemies.filter(e => e.hp > 100);
    const fastEnemies = enemies.filter(e => e.speed > 80);
    const closeEnemies = enemies.filter(e => e.wpt > 8); // Close to exit
    let targetPriority = 'balanced';
    if (strongEnemies.length > 3)
        targetPriority = 'tank';
    else if (fastEnemies.length > 5)
        targetPriority = 'speed';
    else if (closeEnemies.length > 2)
        targetPriority = 'proximity';
    // Apply adaptive bonuses
    const adaptiveBonus = tower.adaptiveBonus || 0;
    switch (targetPriority) {
        case 'tank':
            tower._tempDamage = tower.damage * (1 + adaptiveBonus);
            return strongEnemies.reduce((best, e) => !best || e.hp > best.hp ? e : best, null);
        case 'speed':
            tower._tempFireRate = tower.fireRate * (1 + adaptiveBonus);
            return fastEnemies.reduce((best, e) => !best || e.speed > best.speed ? e : best, null);
        case 'proximity':
            tower._tempRange = tower.range * (1 + adaptiveBonus * 0.5);
            return closeEnemies.reduce((best, e) => !best || e.wpt > best.wpt ? e : best, null);
        default:
            return enemies.reduce((best, e) => {
                const score = (1000 - e.wpt * 50) + Math.hypot(e.x - tower.x, e.y - tower.y) * 0.1;
                return !best || score < best._score ? { ...e, _score: score } : best;
            }, null);
    }
}
let _heatZoneId = 0;
