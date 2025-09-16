// @ts-nocheck
import { MenuManager } from "./ui/menus/MenuManager";

const canvas = document.getElementById("game") as HTMLCanvasElement;
let menuManager: MenuManager;

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
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  
  // Update game state if game exists in MenuManager
  if (menuManager && menuManager.gameInstance && menuManager.gameInstance.state) {
    menuManager.gameInstance.state.w = rect.width;
    menuManager.gameInstance.state.h = rect.height;
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

// Initialize the menu system instead of directly starting the game
menuManager = new MenuManager(canvas);

// Handle window resize with debouncing
window.addEventListener('resize', handleResize);


