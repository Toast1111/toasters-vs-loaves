// @ts-nocheck
export const RARITY={COMMON:1, RARE:1.15, EPIC:1.35, LEGENDARY:1.6};

// Upgrade path system: Each tower has 3 paths with 5 tiers each
// Rules: All paths can reach Tier 2. Only one path can reach tiers 3, 4, and 5.
// Path 0: Usually damage/offense focused
// Path 1: Usually utility/support focused  
// Path 2: Usually special mechanics/unique abilities

export const TOWER_TYPES=[
  { key:'basic', name:'Counter Toaster', cost:100, rarity:RARITY.COMMON, 
    desc:'Reliable two‑slot toaster. Pops heat pellets at loaves.',
    base:{range:120, fireRate:1, damage:12, projectileSpeed:300},
    upgradePaths:[
      { // Path 0: Heat Mastery - Damage focused
        name: 'Heat Mastery',
        upgrades:[
          {name:'Bagel Mode', cost:60, tip:'+6 damage', 
           effect:t=>t.damage+=6},
          {name:'Precision Coils', cost:120, tip:'+10 damage, +0.2 fire rate', 
           effect:t=>{t.damage+=10; t.fireRate+=0.2;}},
          {name:'Tungsten Elements', cost:200, tip:'+15 damage, burns enemies', 
           effect:t=>{t.damage+=15; t.burnChance=0.3; t.burnDamage=5;}},
          {name:'Plasma Injection', cost:350, tip:'+25 damage, stronger burns', 
           effect:t=>{t.damage+=25; t.burnChance=0.5; t.burnDamage=10;}},
          {name:'Solar Core', cost:600, tip:'Massive damage, burn spreads', 
           effect:t=>{t.damage+=50; t.burnChance=0.8; t.burnDamage=20; t.burnSpread=true;}}
        ]
      },
      { // Path 1: Range & Detection - Utility focused
        name: 'Detection Array',
        upgrades:[
          {name:'Crumb Catcher', cost:80, tip:'+25 range', 
           effect:t=>t.range+=25},
          {name:'Heat Sensor', cost:150, tip:'+40 range, detects cloaked', 
           effect:t=>{t.range+=40; t.camoDetection=true;}},
          {name:'Thermal Scope', cost:250, tip:'+60 range, slows enemies', 
           effect:t=>{t.range+=60; t.slowChance=0.4; t.slowAmount=0.3;}},
          {name:'Satellite Link', cost:420, tip:'+100 range, reveals all enemies', 
           effect:t=>{t.range+=100; t.globalDetection=true; t.slowChance=0.6;}},
          {name:'Orbital Strike', cost:800, tip:'Unlimited range, devastating slow', 
           effect:t=>{t.range=9999; t.slowChance=0.9; t.slowAmount=0.7; t.orbital=true;}}
        ]
      },
      { // Path 2: Rapid Fire - Speed focused
        name: 'Rapid Response',
        upgrades:[
          {name:'Turbo Springs', cost:110, tip:'+0.4 fire rate', 
           effect:t=>t.fireRate+=0.4},
          {name:'Auto-Cycle', cost:180, tip:'+0.6 fire rate, chance for double shot', 
           effect:t=>{t.fireRate+=0.6; t.doubleShot=0.2;}},
          {name:'Chain Reaction', cost:300, tip:'+0.8 fire rate, pierce +1', 
           effect:t=>{t.fireRate+=0.8; t.pierce+=1; t.doubleShot=0.35;}},
          {name:'Overcharge Mode', cost:500, tip:'+1.2 fire rate, pierce +2, chain lightning', 
           effect:t=>{t.fireRate+=1.2; t.pierce+=2; t.chainLightning=true; t.doubleShot=0.5;}},
          {name:'Quantum Burst', cost:900, tip:'Ultra-fast firing, splits projectiles', 
           effect:t=>{t.fireRate+=2.0; t.pierce+=3; t.projectileSplit=3; t.doubleShot=0.8;}}
        ]
      }
    ]},
  { key:'wide', name:'4‑Slot Toaster', cost:160, rarity:RARITY.RARE,
    desc:'Wider heat, slower pop. Great coverage.',
    base:{range:150, fireRate:0.7, damage:16, projectileSpeed:260},
    upgradePaths:[
      { // Path 0: Area Devastation
        name: 'Area Control',
        upgrades:[
          {name:'Quartz Rods', cost:90, tip:'+10 damage', 
           effect:t=>t.damage+=10},
          {name:'Wide Spread', cost:160, tip:'+15 damage, larger projectiles', 
           effect:t=>{t.damage+=15; t.projectileSize=1.5;}},
          {name:'Heat Wave', cost:280, tip:'+20 damage, splash damage', 
           effect:t=>{t.damage+=20; t.splash=50; t.splashDmg=12;}},
          {name:'Thermal Burst', cost:450, tip:'+30 damage, bigger splash, stuns', 
           effect:t=>{t.damage+=30; t.splash=80; t.splashDmg=20; t.stunChance=0.3;}},
          {name:'Nuclear Toast', cost:750, tip:'Massive area damage, massive stun', 
           effect:t=>{t.damage+=60; t.splash=120; t.splashDmg=40; t.stunChance=0.7; t.stunDuration=2;}}
        ]
      },
      { // Path 1: Support & Economy  
        name: 'Heat Shield',
        upgrades:[
          {name:'Heat Shield', cost:70, tip:'+35 range', 
           effect:t=>t.range+=35},
          {name:'Thermal Barrier', cost:140, tip:'+50 range, blocks projectiles', 
           effect:t=>{t.range+=50; t.projectileBlock=true;}},
          {name:'Economic Heating', cost:240, tip:'+70 range, generates coins', 
           effect:t=>{t.range+=70; t.coinGeneration=2;}},
          {name:'Industrial Complex', cost:400, tip:'+100 range, boosts nearby towers', 
           effect:t=>{t.range+=100; t.coinGeneration=5; t.towerBoost={damage:1.2, fireRate:1.1};}},
          {name:'Mega Factory', cost:700, tip:'Global boost, massive coin generation', 
           effect:t=>{t.range+=150; t.coinGeneration=12; t.globalBoost=true; t.towerBoost={damage:1.5, fireRate:1.3};}}
        ]
      },
      { // Path 2: Precision & Speed
        name: 'Smart Targeting',
        upgrades:[
          {name:'Dual Thermostat', cost:120, tip:'+0.35 fire rate', 
           effect:t=>t.fireRate+=0.35},
          {name:'Smart Targeting', cost:200, tip:'+0.5 fire rate, prioritizes strong enemies', 
           effect:t=>{t.fireRate+=0.5; t.smartTargeting=true;}},
          {name:'Predictive AI', cost:350, tip:'+0.8 fire rate, lead targeting', 
           effect:t=>{t.fireRate+=0.8; t.leadTargeting=true; t.smartTargeting=true;}},
          {name:'Quantum Computer', cost:600, tip:'+1.2 fire rate, perfect accuracy', 
           effect:t=>{t.fireRate+=1.2; t.perfectAccuracy=true; t.alwaysHit=true;}},
          {name:'Sentient Toaster', cost:1000, tip:'Adaptive AI, controls other towers', 
           effect:t=>{t.fireRate+=2.0; t.aiControl=true; t.adaptiveTargeting=true; t.networkBoost=true;}}
        ]
      }
    ]},
  { key:'oven', name:'Mini Oven', cost:220, rarity:RARITY.RARE,
    desc:'Slow baker. Launches sizzling arcs (splash).',
    base:{range:170, fireRate:0.5, damage:30, projectileSpeed:220, splash:40, splashDmg:14},
    upgradePaths:[
      { // Path 0: Explosive Cooking
        name: 'Explosive Cuisine',
        upgrades:[
          {name:'Pizza Stone', cost:120, tip:'+16 damage', 
           effect:t=>t.damage+=16},
          {name:'Molten Core', cost:200, tip:'+25 damage, +10 splash damage', 
           effect:t=>{t.damage+=25; t.splashDmg+=10;}},
          {name:'Volcanic Oven', cost:350, tip:'+40 damage, leaves fire patches', 
           effect:t=>{t.damage+=40; t.splashDmg+=20; t.firePatches=true; t.fireDuration=3;}},
          {name:'Magma Chamber', cost:600, tip:'+70 damage, spreading fire', 
           effect:t=>{t.damage+=70; t.splashDmg+=35; t.fireSpread=true; t.fireDuration=5;}},
          {name:'Planetary Forge', cost:1000, tip:'Devastating explosions, permanent fire zones', 
           effect:t=>{t.damage+=120; t.splashDmg+=60; t.splash+=40; t.permanentFire=true; t.chainExplosions=true;}}
        ]
      },
      { // Path 1: Convection Master
        name: 'Convection Control',
        upgrades:[
          {name:'Convection Fan', cost:110, tip:'+0.25 fire rate', 
           effect:t=>t.fireRate+=0.25},
          {name:'Air Circulation', cost:180, tip:'+0.4 fire rate, pulls enemies closer', 
           effect:t=>{t.fireRate+=0.4; t.enemyPull=true; t.pullStrength=20;}},
          {name:'Cyclone Oven', cost:320, tip:'+0.6 fire rate, stronger pull, slows enemies', 
           effect:t=>{t.fireRate+=0.6; t.pullStrength=40; t.cycloneSlowing=true;}},
          {name:'Hurricane Force', cost:550, tip:'+1.0 fire rate, massive pull, damages over time', 
           effect:t=>{t.fireRate+=1.0; t.pullStrength=80; t.hurricaneDamage=15; t.pullDamage=true;}},
          {name:'Atmospheric Processor', cost:900, tip:'Global weather control, ultimate pull power', 
           effect:t=>{t.fireRate+=1.5; t.globalWeather=true; t.pullStrength=150; t.weatherDamage=30;}}
        ]
      },
      { // Path 2: Long Range Artillery  
        name: 'Artillery Platform',
        upgrades:[
          {name:'Long Pan', cost:130, tip:'+40 range', 
           effect:t=>t.range+=40},
          {name:'Mortar Mode', cost:220, tip:'+70 range, indirect fire', 
           effect:t=>{t.range+=70; t.indirectFire=true; t.mortarTrajectory=true;}},
          {name:'Siege Engine', cost:380, tip:'+120 range, penetrates armor', 
           effect:t=>{t.range+=120; t.armorPiercing=true; t.siegeMode=true;}},
          {name:'Artillery Platform', cost:650, tip:'+200 range, multiple targets', 
           effect:t=>{t.range+=200; t.multiTarget=3; t.artilleryBarrage=true;}},
          {name:'Orbital Cannon', cost:1100, tip:'Map-wide range, devastating barrages', 
           effect:t=>{t.range=9999; t.multiTarget=8; t.orbitalStrike=true; t.mapWideBombardment=true;}}
        ]
      }
    ]},
  { key:'microwave', name:'Microwave', cost:260, rarity:RARITY.EPIC,
    desc:'Zaps across lines instantly (pierce 2).',
    base:{range:190, fireRate:0.8, damage:18, projectileSpeed:999, pierce:2},
    upgradePaths:[
      { // Path 0: Power Amplification
        name: 'Microwave Mastery',
        upgrades:[
          {name:'Inverter Tech', cost:140, tip:'+10 damage', 
           effect:t=>t.damage+=10},
          {name:'High Frequency', cost:240, tip:'+18 damage, +1 pierce', 
           effect:t=>{t.damage+=18; t.pierce+=1;}},
          {name:'Radar Array', cost:420, tip:'+30 damage, +2 pierce, seeks targets', 
           effect:t=>{t.damage+=30; t.pierce+=2; t.homing=true;}},
          {name:'Phased Array', cost:700, tip:'+50 damage, +3 pierce, bounces between enemies', 
           effect:t=>{t.damage+=50; t.pierce+=3; t.ricochet=true; t.bounceCount=3;}},
          {name:'Quantum Entanglement', cost:1200, tip:'Massive damage, infinite pierce, teleports', 
           effect:t=>{t.damage+=100; t.pierce=999; t.quantumTeleport=true; t.dimensionalRift=true;}}
        ]
      },
      { // Path 1: Microwave Networks
        name: 'Network Control',
        upgrades:[
          {name:'Wave Guide', cost:150, tip:'+50 range', 
           effect:t=>t.range+=50},
          {name:'Relay Tower', cost:260, tip:'+80 range, chains to other microwaves', 
           effect:t=>{t.range+=80; t.networkChain=true;}},
          {name:'Signal Booster', cost:450, tip:'+120 range, boosts networked towers', 
           effect:t=>{t.range+=120; t.networkBoost={damage:1.3, fireRate:1.2};}},
          {name:'Satellite Network', cost:750, tip:'+200 range, shares targeting data', 
           effect:t=>{t.range+=200; t.sharedTargeting=true; t.satelliteUplink=true;}},
          {name:'Global Grid', cost:1300, tip:'Unlimited range, controls all electronics', 
           effect:t=>{t.range=9999; t.globalControl=true; t.disruptsEnemyElectronics=true; t.empPulse=true;}}
        ]
      },
      { // Path 2: Rapid Pulse
        name: 'Pulse Generator', 
        upgrades:[
          {name:'Auto‑Reheat', cost:180, tip:'+0.5 fire rate', 
           effect:t=>t.fireRate+=0.5},
          {name:'Pulse Mode', cost:300, tip:'+0.8 fire rate, bursts of 3', 
           effect:t=>{t.fireRate+=0.8; t.burstFire=3; t.burstDelay=0.1;}},
          {name:'Rapid Cycling', cost:520, tip:'+1.2 fire rate, bursts of 5', 
           effect:t=>{t.fireRate+=1.2; t.burstFire=5; t.rapidCycling=true;}},
          {name:'Overclocked Array', cost:880, tip:'+2.0 fire rate, continuous beam', 
           effect:t=>{t.fireRate+=2.0; t.continuousBeam=true; t.overclocked=true;}},
          {name:'Temporal Accelerator', cost:1500, tip:'Time manipulation, ultra-rapid fire', 
           effect:t=>{t.fireRate+=4.0; t.timeManipulation=true; t.temporalAcceleration=true; t.slowsTime=true;}}
        ]
      }
    ]},
  { key:'airfryer', name:'Air Fryer', cost:340, rarity:RARITY.EPIC,
    desc:'Rapid-fire hot air blasts. Lower damage but extreme speed.',
    base:{range:140, fireRate:3.5, damage:8, projectileSpeed:450},
    upgradePaths:[
      { // Path 0: Pressure Cooker
        name: 'Pressure Systems',
        upgrades:[
          {name:'Precision Jets', cost:140, tip:'+6 damage', 
           effect:t=>t.damage+=6},
          {name:'Pressurized Chamber', cost:230, tip:'+10 damage, chance to crit', 
           effect:t=>{t.damage+=10; t.critChance=0.15; t.critMultiplier=2.0;}},
          {name:'Superheated Air', cost:400, tip:'+16 damage, higher crit chance', 
           effect:t=>{t.damage+=16; t.critChance=0.25; t.critMultiplier=2.5; t.superheated=true;}},
          {name:'Plasma Vortex', cost:680, tip:'+25 damage, crits cause explosions', 
           effect:t=>{t.damage+=25; t.critChance=0.4; t.critMultiplier=3.0; t.critExplosions=true;}},
          {name:'Miniature Sun', cost:1150, tip:'Extreme damage, constant crits, area effect', 
           effect:t=>{t.damage+=50; t.critChance=0.8; t.critMultiplier=4.0; t.solarFlares=true; t.constantHeat=true;}}
        ]
      },
      { // Path 1: Extended Operations
        name: 'Extended Range',
        upgrades:[
          {name:'Extended Basket', cost:180, tip:'+45 range', 
           effect:t=>t.range+=45},
          {name:'Circulation Fan', cost:290, tip:'+70 range, pulls in projectiles', 
           effect:t=>{t.range+=70; t.projectileAttraction=true;}},
          {name:'Atmospheric Control', cost:500, tip:'+110 range, creates wind currents', 
           effect:t=>{t.range+=110; t.windCurrents=true; t.redirectsProjectiles=true;}},
          {name:'Weather Station', cost:820, tip:'+180 range, controls battlefield weather', 
           effect:t=>{t.range+=180; t.weatherControl=true; t.globalWindEffects=true;}},
          {name:'Climate Controller', cost:1400, tip:'Map-wide effects, ultimate weather control', 
           effect:t=>{t.range=9999; t.climateControl=true; t.globalTemperatureControl=true; t.weatherDomination=true;}}
        ]
      },
      { // Path 2: Cyclone Mode
        name: 'Cyclone Generation',
        upgrades:[
          {name:'Cyclone Mode', cost:160, tip:'+1.2 fire rate', 
           effect:t=>t.fireRate+=1.2},
          {name:'Twin Cyclones', cost:280, tip:'+1.8 fire rate, shoots 2 projectiles', 
           effect:t=>{t.fireRate+=1.8; t.multiShot=2;}},
          {name:'Tornado Generator', cost:480, tip:'+2.5 fire rate, shoots 3 projectiles', 
           effect:t=>{t.fireRate+=2.5; t.multiShot=3; t.tornadoEffect=true;}},
          {name:'Hurricane Engine', cost:800, tip:'+3.5 fire rate, creates hurricane zones', 
           effect:t=>{t.fireRate+=3.5; t.multiShot=5; t.hurricaneZones=true; t.persistentTornados=true;}},
          {name:'Atmospheric Devastator', cost:1350, tip:'Ultimate speed, reality-bending winds', 
           effect:t=>{t.fireRate+=6.0; t.multiShot=8; t.realityBendingWinds=true; t.dimensionalVortex=true;}}
        ]
      }
    ]},
  { key:'convection', name:'Convection Oven', cost:420, rarity:RARITY.EPIC,
    desc:'Creates persistent heat zones that slow and damage.',
    base:{range:200, fireRate:0.3, damage:45, projectileSpeed:180, special:'heatzone'},
    upgradePaths:[
      { // Path 0: Zone Control
        name: 'Thermal Dominion',
        upgrades:[
          {name:'Ceramic Core', cost:180, tip:'+25 damage', 
           effect:t=>t.damage+=25},
          {name:'Heat Sink Array', cost:310, tip:'+40 damage, zones last longer', 
           effect:t=>{t.damage+=40; t.zoneDuration=1.5;}},
          {name:'Molten Foundation', cost:530, tip:'+65 damage, zones spread', 
           effect:t=>{t.damage+=65; t.zoneDuration=2.0; t.zoneSpread=true;}},
          {name:'Infernal Engine', cost:900, tip:'+100 damage, overlapping zones amplify', 
           effect:t=>{t.damage+=100; t.zoneDuration=3.0; t.zoneAmplification=true; t.stackingZones=true;}},
          {name:'Apocalypse Furnace', cost:1500, tip:'Massive damage, permanent heat zones', 
           effect:t=>{t.damage+=200; t.permanentZones=true; t.globalHeatDamage=true; t.apocalypticHeat=true;}}
        ]
      },
      { // Path 1: Industrial Scale
        name: 'Industrial Complex',
        upgrades:[
          {name:'Industrial Fan', cost:200, tip:'+0.2 fire rate', 
           effect:t=>t.fireRate+=0.2},
          {name:'Assembly Line', cost:340, tip:'+0.35 fire rate, automated production', 
           effect:t=>{t.fireRate+=0.35; t.automation=true; t.resourceGeneration=3;}},
          {name:'Factory Network', cost:580, tip:'+0.5 fire rate, boosts production towers', 
           effect:t=>{t.fireRate+=0.5; t.resourceGeneration=6; t.factoryBoost=true;}},
          {name:'Mega Complex', cost:980, tip:'+0.8 fire rate, mass production bonuses', 
           effect:t=>{t.fireRate+=0.8; t.resourceGeneration=12; t.massProduction=true; t.efficiencyBonus=true;}},
          {name:'Planetary Foundry', cost:1650, tip:'Ultimate production, reshapes battlefield', 
           effect:t=>{t.fireRate+=1.5; t.resourceGeneration=25; t.planetaryControl=true; t.terraforming=true;}}
        ]
      },
      { // Path 2: Wide Area
        name: 'Thermal Expansion',
        upgrades:[
          {name:'Wide Vents', cost:220, tip:'+60 range', 
           effect:t=>t.range+=60},
          {name:'Thermal Network', cost:380, tip:'+100 range, links zones together', 
           effect:t=>{t.range+=100; t.thermalNetwork=true; t.linkedZones=true;}},
          {name:'Continental Heater', cost:650, tip:'+170 range, affects entire regions', 
           effect:t=>{t.range+=170; t.continentalRange=true; t.regionalEffects=true;}},
          {name:'Global Warming', cost:1100, tip:'+300 range, planet-wide effects', 
           effect:t=>{t.range+=300; t.globalWarming=true; t.planetWideHeat=true;}},
          {name:'Stellar Manipulator', cost:1800, tip:'Unlimited range, controls solar energy', 
           effect:t=>{t.range=9999; t.stellarControl=true; t.solarManipulation=true; t.starPower=true;}}
        ]
      }
    ]},
  { key:'industrial', name:'Industrial Toaster', cost:580, rarity:RARITY.LEGENDARY,
    desc:'Massive chrome beast. Devastating damage but very slow.',
    base:{range:250, fireRate:0.15, damage:120, projectileSpeed:200, splash:60, splashDmg:50},
    upgradePaths:[
      { // Path 0: Raw Power
        name: 'Tungsten Mastery',
        upgrades:[
          {name:'Tungsten Coils', cost:280, tip:'+80 damage', 
           effect:t=>t.damage+=80},
          {name:'Reinforced Core', cost:480, tip:'+130 damage, armor piercing', 
           effect:t=>{t.damage+=130; t.armorPiercing=3;}},
          {name:'Adamantine Frame', cost:820, tip:'+200 damage, ignores all armor', 
           effect:t=>{t.damage+=200; t.armorPiercing=999; t.absolutePiercing=true;}},
          {name:'Quantum Annihilator', cost:1400, tip:'+350 damage, deletes enemy defenses', 
           effect:t=>{t.damage+=350; t.defenseDestruction=true; t.quantumDamage=true;}},
          {name:'Reality Crusher', cost:2400, tip:'Unimaginable damage, breaks game rules', 
           effect:t=>{t.damage+=700; t.realityBreaking=true; t.omnipotentDamage=true; t.transcendentPower=true;}}
        ]
      },
      { // Path 1: Hydraulic Systems
        name: 'Hydraulic Mastery',
        upgrades:[
          {name:'Hydraulic Lift', cost:320, tip:'+0.1 fire rate', 
           effect:t=>t.fireRate+=0.1},
          {name:'Pneumatic Systems', cost:550, tip:'+0.18 fire rate, knockback effects', 
           effect:t=>{t.fireRate+=0.18; t.knockback=true; t.knockbackPower=80;}},
          {name:'Steam Power', cost:940, tip:'+0.3 fire rate, steam clouds slow enemies', 
           effect:t=>{t.fireRate+=0.3; t.knockbackPower=120; t.steamClouds=true; t.steamSlowing=true;}},
          {name:'Hydraulic Overdrive', cost:1600, tip:'+0.5 fire rate, massive area control', 
           effect:t=>{t.fireRate+=0.5; t.steamClouds=true; t.hydraulicSlam=true; t.areaControl=true;}},
          {name:'Mechanical God', cost:2700, tip:'Ultra-speed, controls all machinery', 
           effect:t=>{t.fireRate+=1.0; t.mechanicalDominion=true; t.infiniteHydraulics=true; t.machineryControl=true;}}
        ]
      },
      { // Path 2: Chrome Perfection
        name: 'Chrome Mastery',
        upgrades:[
          {name:'Chrome Reflector', cost:300, tip:'+80 range, +20 splash', 
           effect:t=>{t.range+=80; t.splash+=20;}},
          {name:'Mirror Finish', cost:520, tip:'+130 range, +40 splash, reflects projectiles', 
           effect:t=>{t.range+=130; t.splash+=40; t.projectileReflection=true;}},
          {name:'Prismatic Array', cost:890, tip:'+200 range, +70 splash, splits light beams', 
           effect:t=>{t.range+=200; t.splash+=70; t.lightBeams=true; t.prismaticEffects=true;}},
          {name:'Perfect Mirror', cost:1500, tip:'+350 range, +120 splash, absolute reflection', 
           effect:t=>{t.range+=350; t.splash+=120; t.perfectReflection=true; t.lightAmplification=true;}},
          {name:'Cosmic Reflector', cost:2500, tip:'Unlimited range, reflects reality itself', 
           effect:t=>{t.range=9999; t.splash+=200; t.realityReflection=true; t.cosmicMirror=true; t.universalReflection=true;}}
        ]
      }
    ]},
  { key:'chef', name:'Chef Special Toaster', cost:480, rarity:RARITY.LEGENDARY,
    desc:'Adaptive AI targeting. Switches modes based on threat level.',
    base:{range:180, fireRate:1.2, damage:35, projectileSpeed:350, special:'adaptive'},
    upgradePaths:[
      { // Path 0: Neural Networks
        name: 'AI Evolution',
        upgrades:[
          {name:'Neural Network', cost:240, tip:'Enhanced adaptation', 
           effect:t=>{t.adaptiveBonus=0.5; t.learningRate=1.2;}},
          {name:'Deep Learning', cost:410, tip:'Predicts enemy behavior, learns patterns', 
           effect:t=>{t.adaptiveBonus=1.0; t.learningRate=1.5; t.behaviorPrediction=true;}},
          {name:'Quantum Consciousness', cost:700, tip:'Consciousness emerges, perfect adaptation', 
           effect:t=>{t.adaptiveBonus=2.0; t.consciousness=true; t.perfectAdaptation=true;}},
          {name:'Artificial Superintelligence', cost:1200, tip:'Surpasses human intelligence, reality analysis', 
           effect:t=>{t.adaptiveBonus=4.0; t.superintelligence=true; t.realityAnalysis=true;}},
          {name:'Transcendent Mind', cost:2000, tip:'Beyond AI, manipulates causality itself', 
           effect:t=>{t.adaptiveBonus=8.0; t.transcendentMind=true; t.causalityManipulation=true; t.omniscience=true;}}
        ]
      },
      { // Path 1: Multi-Mode Systems
        name: 'Modular Systems',
        upgrades:[
          {name:'Multi-Mode', cost:260, tip:'+20 damage, +0.3 fire rate', 
           effect:t=>{t.damage+=20; t.fireRate+=0.3;}},
          {name:'Adaptive Arsenal', cost:450, tip:'+35 damage, +0.5 fire rate, multiple weapon types', 
           effect:t=>{t.damage+=35; t.fireRate+=0.5; t.weaponTypes=3; t.situationalWeapons=true;}},
          {name:'Modular Platform', cost:760, tip:'+55 damage, +0.8 fire rate, self-modifying', 
           effect:t=>{t.damage+=55; t.fireRate+=0.8; t.weaponTypes=5; t.selfModifying=true;}},
          {name:'Omniversal Arsenal', cost:1300, tip:'+90 damage, +1.3 fire rate, infinite weapon types', 
           effect:t=>{t.damage+=90; t.fireRate+=1.3; t.weaponTypes=999; t.omniversalWeapons=true;}},
          {name:'Reality Arsenal', cost:2200, tip:'Unlimited damage types, breaks physical laws', 
           effect:t=>{t.damage+=150; t.fireRate+=2.0; t.realityWeapons=true; t.lawBreaking=true; t.conceptualDamage=true;}}
        ]
      },
      { // Path 2: Quantum Sensors
        name: 'Sensor Networks',
        upgrades:[
          {name:'Quantum Sensors', cost:300, tip:'+70 range, +1 pierce', 
           effect:t=>{t.range+=70; t.pierce+=1;}},
          {name:'Dimensional Scanning', cost:510, tip:'+120 range, +2 pierce, sees through dimensions', 
           effect:t=>{t.range+=120; t.pierce+=2; t.dimensionalSight=true; t.phaseDetection=true;}},
          {name:'Temporal Sensors', cost:870, tip:'+200 range, +3 pierce, sees through time', 
           effect:t=>{t.range+=200; t.pierce+=3; t.temporalSight=true; t.futureTargeting=true;}},
          {name:'Omniversal Detection', cost:1500, tip:'+350 range, +5 pierce, sees all realities', 
           effect:t=>{t.range+=350; t.pierce+=5; t.omniversalSight=true; t.multiverseTargeting=true;}},
          {name:'Absolute Awareness', cost:2500, tip:'Unlimited range, infinite pierce, knows everything', 
           effect:t=>{t.range=9999; t.pierce=999; t.absoluteAwareness=true; t.omniscience=true; t.totalKnowledge=true;}}
        ]
      }
    ]}
];

// Upgrade path constraints like BTD6
export const UPGRADE_CONSTRAINTS = {
  maxTier5Paths: 1,  // Only one path can go to tier 5 (implied by single path > 2)
  maxTiers: 5        // 5 tiers per path
};

export function getTowerBase(k){ return TOWER_TYPES.find(t=>t.key===k); }

// Helper function to check if an upgrade is allowed
export function canUpgrade(tower, pathIndex, currentTier) {
  const constraints = UPGRADE_CONSTRAINTS;
  const nextTier = currentTier + 1;
  
  // Check if we're trying to exceed max tiers
  if (nextTier > constraints.maxTiers) return false;
  
  // Only restriction: at most one path may exceed Tier 2 (tiers 3–5)
  if (nextTier >= 3) {
    const pathsAt3Plus = tower.upgradeTiers.filter(tier => tier >= 3).length;
    const thisPathAt3Plus = tower.upgradeTiers[pathIndex] >= 3;
    // Allow if this path is already the 3+ path, else only if none exist yet
    return thisPathAt3Plus || pathsAt3Plus === 0;
  }
  
  // Tiers 1–2 are always allowed on all paths
  return true;
}
