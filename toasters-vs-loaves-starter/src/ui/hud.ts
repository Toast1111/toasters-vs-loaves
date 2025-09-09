import type { Game } from "../game/Game";

export function mountHud(root: HTMLElement, game: Game) {
  root.innerHTML = `Coins: <b id="coins">150</b> | Lives: <b id="lives">100</b> | Wave: <b id="wave">0</b> | AP: <b id="ap">0</b>`;
  const coins = root.querySelector("#coins") as HTMLElement;
  const lives = root.querySelector("#lives") as HTMLElement;
  const wave  = root.querySelector("#wave") as HTMLElement;
  const ap    = root.querySelector("#ap") as HTMLElement;

  // Simple reactive loop — replace with a proper UI later if you want
  const id = setInterval(() => {
    coins.textContent = String(game.state.coins);
    lives.textContent = String(game.state.lives);
    wave.textContent  = String(game.state.wave);
    ap.textContent    = String(game.state.ap);
  }, 100);

  // Expose a cleanup if needed
  (game as any).__hudInterval = id;
}
