import { createLoop } from "./core/loop";
import { Game } from "./game/Game";
import { mountHud } from "./ui/hud";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const hudRoot = document.getElementById("hud") as HTMLDivElement;
const ctx = canvas.getContext("2d")!;

const game = new Game(canvas, ctx);
mountHud(hudRoot, game);

createLoop((dt) => {
  game.update(dt);
  game.draw();
});
