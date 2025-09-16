// @ts-nocheck
import { Game } from "./game/Game";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
let game;

// Function to resize canvas to fit its container
function resizeCanvas() {
  const container = canvas.parentElement!;
  const rect = container.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  
  // Set display size (css pixels)
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  
  // Set actual size in memory (scaled for retina displays)
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  // Scale the context for retina displays
  ctx.scale(dpr, dpr);
  
  // Update game state if game exists
  if (game && game.state) {
    game.state.w = rect.width;
    game.state.h = rect.height;
  }
}

// Debounced resize handler
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeCanvas, 100);
}

// Initial resize
resizeCanvas();

game = new Game(canvas, ctx);
// Set correct initial state dimensions after canvas is sized
const rect = canvas.parentElement!.getBoundingClientRect();
game.state.w = rect.width;
game.state.h = rect.height;
game.init();

// Handle window resize with debouncing
window.addEventListener('resize', handleResize);

function frame(now:number){ 
  const dt = game.stepTime(now); 
  game.update(dt); 
  game.draw(); 
  requestAnimationFrame(frame); 
}
requestAnimationFrame(frame);
