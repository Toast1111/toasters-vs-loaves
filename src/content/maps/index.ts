// New level system exports
export * from './types';
import { trainingKitchen } from './levels.trainingKitchen';
import { dualLanes } from './levels.dualLanes';
import { triSplitTest } from './levels.triSplitTest';
export * from './helpers';

export const LEVELS = {
	[trainingKitchen.id]: trainingKitchen,
	[dualLanes.id]: dualLanes,
	[triSplitTest.id]: triSplitTest
};

export function getLevel(id: string){
	return LEVELS[id];
}

export function listLevels(){
	return Object.values(LEVELS);
}

// Legacy compatibility exports (will be phased out)
export const grid = trainingKitchen.grid;
export const PATH_W = trainingKitchen.pathWidth;
// Provide a flattened first-path waypoints array for old code still importing it
export const waypoints = trainingKitchen.paths[0].waypoints;

// Legacy helpers rely on first level only
function pointSegmentDistance(px,py,ax,ay,bx,by){
	const vx=bx-ax, vy=by-ay; const wx=px-ax, wy=py-ay; const c1=vx*wx+vy*wy; if(c1<=0) return Math.hypot(px-ax,py-ay);
	const c2=vx*vx+vy*vy; if(c2<=c1) return Math.hypot(px-bx,py-by);
	const t=c1/c2; const projx=ax+t*vx, projy=ay+t*vy; return Math.hypot(px-projx,py-projy);
}
export function isPath(xx,yy){
	for(let i=0;i<waypoints.length-1;i++){
		const a=waypoints[i], b=waypoints[i+1];
		if(pointSegmentDistance(xx,yy,a.x,a.y,b.x,b.y)<=PATH_W) return true;
	}
	return false;
}
export function isBuildable(x,y){ return !isPath(x,y); }