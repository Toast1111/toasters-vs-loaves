// Debug script to check tower loading
import { TOWER_TYPES, getTowerBase } from './src/game/towers/index.ts';

console.log('Tower types:', TOWER_TYPES.length);
console.log('Tower keys:', TOWER_TYPES.map(t => t.key));

const airfryer = getTowerBase('airfryer');
console.log('Airfryer found:', !!airfryer);
console.log('Airfryer has draw function:', !!(airfryer && airfryer.draw));
console.log('Airfryer draw function type:', typeof (airfryer && airfryer.draw));

if (airfryer) {
  console.log('Airfryer properties:', Object.keys(airfryer));
}
