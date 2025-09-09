// @ts-nocheck
import { isPath, waypoints, grid } from "./map";
import { breads } from "./breads";
import { projectiles } from "./projectiles";
import { particles } from "./particles";
export function drawScene(ctx, state) {
    const W = state.w, H = state.h;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0d1017";
    ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += grid.ch) {
        for (let x = 0; x < W; x += grid.cw) {
            const cx = x + grid.cw / 2, cy = y + grid.ch / 2;
            const path = isPath(cx, cy);
            ctx.fillStyle = path ? '#1d2331' : '#111827';
            ctx.fillRect(x, y, grid.cw - 1, grid.ch - 1);
        }
    }
    ctx.strokeStyle = "#2a3246";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(waypoints[0].x, waypoints[0].y);
    for (let i = 1; i < waypoints.length; i++) {
        const p = waypoints[i];
        ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    for (const e of breads) {
        if (!e.alive)
            continue;
        const hp = e.hp / e.maxHp;
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.fillStyle = "#c58a55";
        roundedRect(ctx, -14, -10, 28, 20, 8);
        ctx.fillStyle = "#8c5a2f";
        roundedRect(ctx, -14, -12, 28, 8, 6);
        ctx.fillStyle = "#000000aa";
        ctx.fillRect(-14, -16, 28, 3);
        ctx.fillStyle = hp > 0.4 ? '#7bd88f' : '#ff6b6b';
        ctx.fillRect(-14, -16, 28 * hp, 3);
        ctx.restore();
    }
    for (const t of state.toasters) {
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.fillStyle = "#9aa3b2";
        roundedRect(ctx, -16, -14, 32, 28, 6);
        ctx.fillStyle = "#cfd6e2";
        roundedRect(ctx, -14, -12, 28, 10, 4);
        ctx.fillStyle = "#2b2f3c";
        ctx.fillRect(-10, -6, 8, 4);
        ctx.fillRect(2, -6, 8, 4);
        ctx.fillStyle = "#1e2230";
        ctx.beginPath();
        ctx.arc(12, 4, 4, 0, Math.PI * 2);
        ctx.fill();
        if (state.showRanges && (!state.selected || state.selected === t.id)) {
            ctx.strokeStyle = "#3a445f66";
            ctx.beginPath();
            ctx.arc(0, 0, t.range, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    }
    for (const p of projectiles) {
        ctx.fillStyle = "#ffd166";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    for (const pr of particles) {
        ctx.fillStyle = "#e7c08a88";
        ctx.fillRect(pr.x, pr.y, 2, 2);
    }
    for (const f of state.texts) {
        const a = 1 - Math.min(1, f.t / 1.2);
        ctx.globalAlpha = a;
        ctx.fillStyle = f.isBad ? '#ff6b6b' : '#ffd166';
        ctx.font = '12px ui-monospace,Consolas';
        ctx.fillText(f.str, f.x, f.y - 10 - 20 * f.t);
        ctx.globalAlpha = 1;
        f.t += 1 / 60;
    }
}
function roundedRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); ctx.fill(); }
