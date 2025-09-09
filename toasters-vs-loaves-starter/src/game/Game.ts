import { drawScene } from "./render/draw";
import { createInitialState, GameState } from "./state";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  state: GameState;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.state = createInitialState(canvas.width, canvas.height);

    // Example input handling (extend to placements/selections)
    canvas.addEventListener("mousemove", (e) => {
      this.state.mouse.x = e.offsetX;
      this.state.mouse.y = e.offsetY;
    });
    canvas.addEventListener("mouseleave", () => {
      this.state.mouse.x = this.state.mouse.y = -9999;
    });
  }

  update(dt: number) {
    // TODO: Move your spawn/combat/tower logic here over time.
    // Keep this function the orchestrator and delegate to systems.
    this.state.time += dt;
  }

  draw() {
    drawScene(this.ctx, this.state);
  }
}
