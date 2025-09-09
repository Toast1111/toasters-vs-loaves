# Toasters vs Loaves (Vite + TypeScript)

Modularized scaffold to port the single-file HTML canvas TD game.

## Commands
```bash
npm i
npm run dev   # http://localhost:5173
npm run build # outputs to dist/
npm run preview
```

## GitHub Pages
- Set `base` in `vite.config.ts` to `"/YOUR_REPO_NAME/"`.
- Add the provided GitHub Actions workflow (already included).
- Push to `main`; Actions deploys `dist/` to Pages.

## Where to move code
- Canvas boot & loop: `src/main.ts`, `src/core/loop.ts`
- Game orchestration: `src/game/Game.ts`
- State & waypoints: `src/game/state.ts`
- Rendering: `src/game/render/draw.ts`
- HUD: `src/ui/hud.ts`

Port your logic feature by feature:
- entities (toasters, breads, projectiles) under `src/game/entities/`
- systems (spawn, combat, aura) under `src/game/systems/`
- waves and tech tree under `src/game/waves/` and `src/game/tech/`
