// @ts-nocheck
import { MenuManager } from "./ui/menus/MenuManager";

const canvas = document.getElementById("game") as HTMLCanvasElement;
let menuManager: MenuManager;

// Function to resize canvas to fit its container
function resizeCanvas() {
  const container = canvas.parentElement as HTMLElement;
  const wrap = document.querySelector('.wrap') as HTMLElement;
  if (wrap) {
    // ensure wrapper always covers viewport height for dynamic environments
    wrap.style.minHeight = window.innerHeight + 'px';
  }
  // Force container to occupy full height (minus wrapper vertical padding of 20px total)
  const verticalPadding = 20; // .wrap has padding:10px top & bottom
  const availableHeight = window.innerHeight - verticalPadding;
  container.style.height = availableHeight + 'px';

  const rect = container.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  // Prevent redundant resize if dimensions unchanged
  if (canvas.width === rect.width * dpr && canvas.height === rect.height * dpr) return;

  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(1,0,0,1,0,0); // reset any prior scale before applying
  ctx.scale(dpr, dpr);

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


