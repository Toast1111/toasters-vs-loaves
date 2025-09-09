// @ts-nocheck
import { Game } from "./game/Game";
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const game = new Game(canvas, ctx);
game.init();
function frame(now) { const dt = game.stepTime(now); game.update(dt); game.draw(); requestAnimationFrame(frame); }
requestAnimationFrame(frame);
