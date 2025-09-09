export interface Vec2 { x: number; y: number; }

export interface GameState {
  w: number; h: number;
  time: number;
  coins: number; lives: number; wave: number; ap: number;
  // Entities (fill as you port)
  breads: any[];
  toasters: any[];
  projectiles: any[];
  particles: any[];
  waypoints: Vec2[];
  mouse: Vec2;
}

export function createInitialState(w: number, h: number): GameState {
  return {
    w, h,
    time: 0,
    coins: 150, lives: 100, wave: 0, ap: 0,
    breads: [], toasters: [], projectiles: [], particles: [],
    waypoints: [
      {x:-20,y:80},{x:160,y:80},{x:160,y:160},{x:320,y:160},{x:320,y:60},
      {x:560,y:60},{x:560,y:260},{x:420,y:260},{x:420,y:420},{x:780,y:420},
      {x:780,y:200},{x:980,y:200}
    ],
    mouse: { x: -9999, y: -9999 },
  };
}
