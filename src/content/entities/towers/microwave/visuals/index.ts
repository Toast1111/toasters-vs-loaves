// @ts-nocheck
import { GeneralMicrowaveVisuals } from '../general_upgrades_1-2/visuals';
import { WavePowerVisuals } from './path_0/wave_power';
import { NetworkCoverageVisuals } from './path_1/network_coverage';
import { RapidCyclingVisuals } from './path_2/rapid_cycling';

// Main microwave visual coordinator
// Routes to appropriate visual files based on upgrade tiers
export const MicrowaveVisualManager = {
  
  // Get the appropriate visual function for microwave based on upgrade tiers
  getVisualFunction(upgradeTiers) {
    if (!upgradeTiers || upgradeTiers.length !== 3) {
      return GeneralMicrowaveVisuals.base.bind(GeneralMicrowaveVisuals);
    }
    
    const [path0Tier, path1Tier, path2Tier] = upgradeTiers;
    const maxTier = Math.max(path0Tier, path1Tier, path2Tier);
    
    // No upgrades - use base visual
    if (maxTier === 0) {
      return GeneralMicrowaveVisuals.base.bind(GeneralMicrowaveVisuals);
    }
    
    // Determine dominant path (highest tier)
    let dominantPath = -1;
    if (path0Tier === maxTier && maxTier >= 1) dominantPath = 0;
    else if (path1Tier === maxTier && maxTier >= 1) dominantPath = 1;
    else if (path2Tier === maxTier && maxTier >= 1) dominantPath = 2;
    
    // Tier 1-2: Use general upgrade visuals
    if (maxTier <= 2) {
      switch (dominantPath) {
        case 0: return GeneralMicrowaveVisuals.path0_tier12.bind(GeneralMicrowaveVisuals);
        case 1: return GeneralMicrowaveVisuals.path1_tier12.bind(GeneralMicrowaveVisuals);
        case 2: return GeneralMicrowaveVisuals.path2_tier12.bind(GeneralMicrowaveVisuals);
        default: return GeneralMicrowaveVisuals.base.bind(GeneralMicrowaveVisuals);
      }
    }
    
    // Tier 3-5: Use specialized path visuals
    else {
      const tierLevel = maxTier; // 3, 4, or 5
      
      switch (dominantPath) {
        case 0: // Wave Power
          if (tierLevel === 3) return WavePowerVisuals.tier3.bind(WavePowerVisuals);
          if (tierLevel === 4) return WavePowerVisuals.tier4.bind(WavePowerVisuals);
          if (tierLevel === 5) return WavePowerVisuals.tier5.bind(WavePowerVisuals);
          break;
          
        case 1: // Network Coverage
          if (tierLevel === 3) return NetworkCoverageVisuals.tier3.bind(NetworkCoverageVisuals);
          if (tierLevel === 4) return NetworkCoverageVisuals.tier4.bind(NetworkCoverageVisuals);
          if (tierLevel === 5) return NetworkCoverageVisuals.tier5.bind(NetworkCoverageVisuals);
          break;
          
        case 2: // Rapid Cycling
          if (tierLevel === 3) return RapidCyclingVisuals.tier3.bind(RapidCyclingVisuals);
          if (tierLevel === 4) return RapidCyclingVisuals.tier4.bind(RapidCyclingVisuals);
          if (tierLevel === 5) return RapidCyclingVisuals.tier5.bind(RapidCyclingVisuals);
          break;
      }
    }
    
    // Fallback to base visual
    return GeneralMicrowaveVisuals.base.bind(GeneralMicrowaveVisuals);
  }
};
