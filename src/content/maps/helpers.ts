// @ts-nocheck
import { LevelDefinition } from './types';

function pointSegmentDistance(px,py,ax,ay,bx,by){
  const vx=bx-ax, vy=by-ay; const wx=px-ax, wy=py-ay; const c1=vx*wx+vy*wy; if(c1<=0) return Math.hypot(px-ax,py-ay);
  const c2=vx*vx+vy*vy; if(c2<=c1) return Math.hypot(px-bx,py-by);
  const t=c1/c2; const projx=ax+t*vx, projy=ay+t*vy; return Math.hypot(px-projx,py-projy);
}

export function isPathOnLevel(level: LevelDefinition, x:number, y:number){
  for (const path of level.paths){
    const wps = path.waypoints;
    for (let i=0;i<wps.length-1;i++){
      const a=wps[i], b=wps[i+1];
      if(pointSegmentDistance(x,y,a.x,a.y,b.x,b.y) <= level.pathWidth) return true;
    }
  }
  return false;
}

export function isBuildableOnLevel(level: LevelDefinition, x:number, y:number){
  return !isPathOnLevel(level, x, y);
}
