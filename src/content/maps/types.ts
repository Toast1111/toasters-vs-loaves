// @ts-nocheck
export interface LevelPath {
  id: string;
  waypoints: { x: number; y: number }[];
  weight?: number; // spawn weighting (relative)
}

export interface LevelDefinition {
  id: string;
  name: string;
  grid: { cw: number; ch: number };
  pathWidth: number;
  paths: LevelPath[];
  theme?: string; // placeholder for future styling
}

export interface LevelRegistry {
  [id: string]: LevelDefinition;
}
