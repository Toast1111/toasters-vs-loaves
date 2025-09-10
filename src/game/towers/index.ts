// @ts-nocheck
export { RARITY } from './shared';

import basic from './basic';
import wide from './wide';
import oven from './oven';
import microwave from './microwave';
import airfryer from './airfryer';
import convection from './convection';
import industrial from './industrial';
import chef from './chef';

export const TOWER_TYPES = [
  basic, wide, oven, microwave, airfryer, convection, industrial, chef
];

export const UPGRADE_CONSTRAINTS = {
  maxTier5Paths: 1,
  maxTiers: 5
};

export function getTowerBase(k){ return TOWER_TYPES.find(t=>t.key===k); }

export function canUpgrade(tower, pathIndex, currentTier) {
  const nextTier = currentTier + 1;
  if (nextTier > UPGRADE_CONSTRAINTS.maxTiers) return false;
  if (nextTier >= 3) {
    const pathsAt3Plus = tower.upgradeTiers.filter(tier => tier >= 3).length;
    const thisPathAt3Plus = tower.upgradeTiers[pathIndex] >= 3;
    return thisPathAt3Plus || pathsAt3Plus === 0;
  }
  return true;
}
