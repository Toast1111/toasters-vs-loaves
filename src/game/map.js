// @ts-nocheck
export const PATH_W = 36;
export const waypoints = [
    { x: -20, y: 80 }, { x: 160, y: 80 }, { x: 160, y: 160 }, { x: 320, y: 160 }, { x: 320, y: 60 },
    { x: 560, y: 60 }, { x: 560, y: 260 }, { x: 420, y: 260 }, { x: 420, y: 420 }, { x: 780, y: 420 }, { x: 780, y: 200 }, { x: 980, y: 200 }
];
export const grid = { cw: 30, ch: 30 };
function pointSegmentDistance(px, py, ax, ay, bx, by) {
    const vx = bx - ax, vy = by - ay;
    const wx = px - ax, wy = py - ay;
    const c1 = vx * wx + vy * wy;
    if (c1 <= 0)
        return Math.hypot(px - ax, py - ay);
    const c2 = vx * vx + vy * vy;
    if (c2 <= c1)
        return Math.hypot(px - bx, py - by);
    const t = c1 / c2;
    const projx = ax + t * vx, projy = ay + t * vy;
    return Math.hypot(px - projx, py - projy);
}
export function isPath(xx, yy) {
    for (let i = 0; i < waypoints.length - 1; i++) {
        const a = waypoints[i], b = waypoints[i + 1];
        if (pointSegmentDistance(xx, yy, a.x, a.y, b.x, b.y) <= PATH_W)
            return true;
    }
    return false;
}
export function isBuildable(x, y) { return !isPath(x, y); }
