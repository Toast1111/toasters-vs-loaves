// @ts-nocheck
// Small canvas drawing helpers shared by renderers

export function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

export function drawDefaultToaster(ctx) {
  ctx.fillStyle = "#9aa3b2"; roundedRect(ctx,-16,-14,32,28,6);
  ctx.fillStyle = "#cfd6e2"; roundedRect(ctx,-14,-12,28,10,4);
  ctx.fillStyle = "#2b2f3c"; ctx.fillRect(-10,-6,8,4); ctx.fillRect(2,-6,8,4);
  ctx.fillStyle = "#1e2230"; ctx.beginPath(); ctx.arc(12,4,4,0,Math.PI*2); ctx.fill();
}
