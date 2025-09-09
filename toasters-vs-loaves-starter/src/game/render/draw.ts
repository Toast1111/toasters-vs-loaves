import type { GameState } from "../state";

export function drawScene(ctx: CanvasRenderingContext2D, s: GameState) {
  // Clear
  ctx.clearRect(0, 0, s.w, s.h);
  ctx.fillStyle = "#0d1017";
  ctx.fillRect(0, 0, s.w, s.h);

  // Simple path preview (just polylines for now)
  ctx.strokeStyle = "#2a3246";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(s.waypoints[0].x, s.waypoints[0].y);
  for (let i = 1; i < s.waypoints.length; i++) {
    const p = s.waypoints[i];
    ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  // Mouse dot (debug)
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(s.mouse.x, s.mouse.y, 3, 0, Math.PI * 2);
  ctx.fill();
}
