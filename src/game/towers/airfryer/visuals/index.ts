// @ts-nocheck
import { GeneralAirfryerVisuals } from '../general_upgrades_1-2/visuals';
import { PressureSystemsVisuals } from './path_0/pressure_systems';
import { ExtendedRangeVisuals } from './path_1/extended_range';
import { CycloneGenerationVisuals } from './path_2/cyclone_generation';

// Main airfryer visual coordinator
// Routes to appropriate visual files based on upgrade tiers
export const AirfryerVisualManager = {
  
  // Get the appropriate visual function for airfryer based on upgrade tiers
  getVisualFunction(upgradeTiers) {
    if (!upgradeTiers || upgradeTiers.length !== 3) {
      return GeneralAirfryerVisuals.base.bind(GeneralAirfryerVisuals);
    }
    
    const [path0Tier, path1Tier, path2Tier] = upgradeTiers;
    const maxTier = Math.max(path0Tier, path1Tier, path2Tier);
    
    // No upgrades - use base visual
    if (maxTier === 0) {
      return GeneralAirfryerVisuals.base.bind(GeneralAirfryerVisuals);
    }
    
    // Determine dominant path (highest tier)
    let dominantPath = -1;
    if (path0Tier === maxTier && maxTier >= 1) dominantPath = 0;
    else if (path1Tier === maxTier && maxTier >= 1) dominantPath = 1;
    else if (path2Tier === maxTier && maxTier >= 1) dominantPath = 2;
    
    // Tier 1-2: Use general upgrade visuals
    if (maxTier <= 2) {
      switch (dominantPath) {
        case 0: return GeneralAirfryerVisuals.path0_tier12.bind(GeneralAirfryerVisuals);
        case 1: return GeneralAirfryerVisuals.path1_tier12.bind(GeneralAirfryerVisuals);
        case 2: return GeneralAirfryerVisuals.path2_tier12.bind(GeneralAirfryerVisuals);
        default: return GeneralAirfryerVisuals.base.bind(GeneralAirfryerVisuals);
      }
    }
    
    // Tier 3-5: Use specialized path visuals
    else {
      const tierLevel = maxTier; // 3, 4, or 5
      
      switch (dominantPath) {
        case 0: // Pressure Systems
          if (tierLevel === 3) return PressureSystemsVisuals.tier3.bind(PressureSystemsVisuals);
          if (tierLevel === 4) return PressureSystemsVisuals.tier4.bind(PressureSystemsVisuals);
          if (tierLevel === 5) return PressureSystemsVisuals.tier5.bind(PressureSystemsVisuals);
          break;
          
        case 1: // Extended Range
          if (tierLevel === 3) return ExtendedRangeVisuals.tier3.bind(ExtendedRangeVisuals);
          if (tierLevel === 4) return ExtendedRangeVisuals.tier4.bind(ExtendedRangeVisuals);
          if (tierLevel === 5) return ExtendedRangeVisuals.tier5.bind(ExtendedRangeVisuals);
          break;
          
        case 2: // Cyclone Generation
          if (tierLevel === 3) return CycloneGenerationVisuals.tier3.bind(CycloneGenerationVisuals);
          if (tierLevel === 4) return CycloneGenerationVisuals.tier4.bind(CycloneGenerationVisuals);
          if (tierLevel === 5) return CycloneGenerationVisuals.tier5.bind(CycloneGenerationVisuals);
          break;
      }
    }
    
    // Fallback to base visual
    return GeneralAirfryerVisuals.base.bind(GeneralAirfryerVisuals);
  }
};