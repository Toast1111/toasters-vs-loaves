// @ts-nocheck

export interface BreadType {
  key: string;
  name: string;
  baseHealth: number;
  baseSpeed: number;
  baseBounty: number;
  description: string;
  weaknesses: string[];
  abilities?: string[];
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Boss';
  special?: string;
  firstAppears: number; // Wave number
  healthFormula?: string;
  speedFormula?: string;
  resistances?: { [key: string]: number };
}

export const BREAD_ENCYCLOPEDIA: BreadType[] = [
  {
    key: 'slice',
    name: 'Bread Slice',
    baseHealth: 20,
    baseSpeed: 70,
    baseBounty: 4,
    description: 'The most basic loaf unit. Soft, squishy, and the backbone of any bread invasion.',
    weaknesses: ['All toaster types', 'Basic heat damage'],
    rarity: 'Common',
    firstAppears: 1,
    healthFormula: '20 + 4×wave',
    speedFormula: '70 + 1.5×wave'
  },
  {
    key: 'baguette',
    name: 'Baguette',
    baseHealth: 80,
    baseSpeed: 60,
    baseBounty: 9,
    description: 'French engineering at its finest. Long, crusty, and harder to defeat than regular slices.',
    weaknesses: ['Microwave towers', 'Piercing damage'],
    rarity: 'Common',
    firstAppears: 3,
    healthFormula: '80 + 10×wave',
    speedFormula: '60 + 1.2×wave'
  },
  {
    key: 'rye',
    name: 'Rye Bread',
    baseHealth: 180,
    baseSpeed: 55,
    baseBounty: 15,
    description: 'Dense, dark, and incredibly resilient. Contains seeds that make it tougher to toast.',
    weaknesses: ['Sustained high heat', 'Industrial toasters'],
    rarity: 'Uncommon',
    firstAppears: 5,
    healthFormula: '180 + 18×wave',
    speedFormula: '55 + 1.1×wave'
  },
  {
    key: 'half_loaf',
    name: 'Half Loaf',
    baseHealth: 120,
    baseSpeed: 50,
    baseBounty: 20,
    description: 'A chunky piece that splits into smaller fragments when destroyed.',
    weaknesses: ['Area damage', 'Explosive projectiles'],
    abilities: ['Splits into 2 bread slices when defeated'],
    rarity: 'Uncommon',
    special: 'split',
    firstAppears: 2,
    healthFormula: '120 + 12×wave',
    speedFormula: '50 + 1×wave'
  },
  {
    key: 'whole_loaf',
    name: 'Whole Loaf',
    baseHealth: 250,
    baseSpeed: 45,
    baseBounty: 35,
    description: 'A complete loaf that breaks down into multiple smaller pieces. Handle with care!',
    weaknesses: ['Convection ovens', 'Multi-hit attacks'],
    abilities: ['Splits into 2 half loaves when defeated'],
    rarity: 'Rare',
    special: 'split',
    firstAppears: 4,
    healthFormula: '250 + 20×wave',
    speedFormula: '45 + 0.8×wave'
  },
  {
    key: 'artisan_loaf',
    name: 'Artisan Loaf',
    baseHealth: 200,
    baseSpeed: 48,
    baseBounty: 45,
    description: 'Handcrafted with premium ingredients. Splits into high-quality dinner rolls.',
    weaknesses: ['Chef-class toasters', 'Gourmet heat settings'],
    abilities: ['Splits into 3 dinner rolls when defeated'],
    rarity: 'Rare',
    special: 'split',
    firstAppears: 7,
    healthFormula: '200 + 15×wave',
    speedFormula: '48 + 0.9×wave'
  },
  {
    key: 'dinner_roll',
    name: 'Dinner Roll',
    baseHealth: 60,
    baseSpeed: 75,
    baseBounty: 12,
    description: 'Small, round, and surprisingly fast. Often appears in groups.',
    weaknesses: ['Quick burst fire', 'Air fryer towers'],
    abilities: ['Splits into 4 crumbs when defeated'],
    rarity: 'Common',
    special: 'split',
    firstAppears: 3,
    healthFormula: '60 + 6×wave',
    speedFormula: '75 + 2×wave'
  },
  {
    key: 'croissant',
    name: 'Croissant',
    baseHealth: 300,
    baseSpeed: 50,
    baseBounty: 30,
    description: 'Buttery, flaky, and blessed with regenerative powers. A mini-boss that heals over time.',
    weaknesses: ['Burst damage', 'Sustained DPS to prevent healing'],
    abilities: ['Regeneration - heals 10% max HP every 2 seconds'],
    rarity: 'Epic',
    special: 'regenerate',
    firstAppears: 5,
    healthFormula: '300 + 25×wave',
    speedFormula: '50 + 1×wave'
  },
  {
    key: 'sourdough_boss',
    name: 'Giant Sourdough',
    baseHealth: 800,
    baseSpeed: 40,
    baseBounty: 150,
    description: 'A massive sourdough loaf with ancient fermentation powers. Boss-class enemy.',
    weaknesses: ['Coordinated toaster fire', 'High-tier upgrades'],
    abilities: ['Massive size - takes 5 lives if it reaches the end', 'Splits when defeated'],
    rarity: 'Boss',
    special: 'split',
    firstAppears: 10,
    healthFormula: '800 + 200×boss_level',
    speedFormula: '40 + 2×boss_level'
  },
  {
    key: 'french_boss',
    name: 'French Bread Titan',
    baseHealth: 600,
    baseSpeed: 35,
    baseBounty: 120,
    description: 'An enormous baguette that can burst forward at incredible speeds.',
    weaknesses: ['Slow towers', 'Predictive targeting'],
    abilities: ['Speed Burst - periodically moves 2.5× faster', 'Massive size'],
    rarity: 'Boss',
    special: 'speed_burst',
    firstAppears: 20,
    healthFormula: '600 + 150×boss_level',
    speedFormula: '35 + 2×boss_level'
  },
  {
    key: 'pretzel_boss',
    name: 'Pretzel Tank',
    baseHealth: 1200,
    baseSpeed: 25,
    baseBounty: 200,
    description: 'A heavily armored pretzel with 50% damage reduction. Slow but nearly unstoppable.',
    weaknesses: ['Armor-piercing rounds', 'Persistent damage over time'],
    abilities: ['Heavy Armor - 50% damage reduction', 'Massive size'],
    rarity: 'Boss',
    special: 'armor',
    firstAppears: 30,
    healthFormula: '1200 + 300×boss_level',
    speedFormula: '25 + 1×boss_level',
    resistances: { physical: 0.5 }
  },
  {
    key: 'butter',
    name: 'Butter',
    baseHealth: 60,
    baseSpeed: 45,
    baseBounty: 18,
    description: 'A slippery stick of butter that leaves a greasy trail behind it, speeding up all other enemies that walk through it.',
    weaknesses: ['Heat damage', 'Fire towers'],
    abilities: ['Leaves butter trail that boosts enemy speed by 40%', 'Trail lasts 8 seconds'],
    rarity: 'Uncommon',
    special: 'trail',
    firstAppears: 3,
    healthFormula: '60 + 8×wave',
    speedFormula: '45 + 0.8×wave'
  }
];

// Function to draw bread art on canvas
export function drawBreadArt(ctx: CanvasRenderingContext2D, breadType: string, size: number = 40) {
  const r = size / 2;
  ctx.save();
  
  if (breadType === 'slice') {
    // Regular slice bread
    ctx.fillStyle="#c58a55"; 
    roundedRect(ctx, -r*0.875, -r*0.625, r*1.75, r*1.25, r*0.5);
    ctx.fillStyle="#8c5a2f"; 
    roundedRect(ctx, -r*0.875, -r*0.75, r*1.75, r*0.5, r*0.375);
  } else if (breadType === 'baguette') {
    // Baguette - elongated French bread
    ctx.fillStyle="#e8c5a0"; 
    roundedRect(ctx, -r*1.4, -r*0.5, r*2.8, r*1.0, r*0.2);
    ctx.fillStyle="#d4b087"; 
    roundedRect(ctx, -r*1.3, -r*0.4, r*2.6, r*0.6, r*0.15);
    // Diagonal score marks
    ctx.strokeStyle="#b8956a"; ctx.lineWidth=1;
    for(let i = -1; i <= 1; i++) {
      ctx.beginPath(); 
      ctx.moveTo(i*r*0.6, -r*0.3); ctx.lineTo(i*r*0.6, r*0.3);
      ctx.stroke();
    }
  } else if (breadType === 'rye') {
    // Rye bread - darker, denser looking
    ctx.fillStyle="#8b4513"; 
    roundedRect(ctx, -r*0.9, -r*0.7, r*1.8, r*1.4, r*0.4);
    ctx.fillStyle="#a0522d"; 
    roundedRect(ctx, -r*0.8, -r*0.6, r*1.6, r*0.8, r*0.3);
    // Seeds texture
    ctx.fillStyle="#654321";
    for(let i = 0; i < 8; i++) {
      const x = (Math.random() - 0.5) * r * 1.4;
      const y = (Math.random() - 0.5) * r * 1.0;
      ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI*2); ctx.fill();
    }
  } else if (breadType === 'half_loaf') {
    // Half loaf - cut in half with jagged edge
    ctx.fillStyle="#e8b887"; 
    // Left half of the loaf (rounded side)
    roundedRect(ctx, -r*0.95, -r*0.75, r*1.2, r*1.5, r*0.6);
    ctx.fillStyle="#d4a574"; 
    roundedRect(ctx, -r*0.85, -r*0.65, r*1.0, r*1.1, r*0.5);
    ctx.fillStyle="#c19661"; 
    roundedRect(ctx, -r*0.75, -r*0.55, r*0.8, r*0.7, r*0.4);
    
    // Jagged cut edge on the right side
    ctx.fillStyle="#b8956a"; 
    ctx.beginPath();
    ctx.moveTo(r*0.25, -r*0.75);
    ctx.lineTo(r*0.4, -r*0.5);
    ctx.lineTo(r*0.2, -r*0.2);
    ctx.lineTo(r*0.35, r*0.1);
    ctx.lineTo(r*0.15, r*0.4);
    ctx.lineTo(r*0.3, r*0.75);
    ctx.lineTo(r*0.25, r*0.75);
    ctx.lineTo(r*0.25, -r*0.75);
    ctx.fill();
    
    // Crumb texture on cut edge
    ctx.fillStyle="#dcc5a0";
    for(let i = 0; i < 6; i++) {
      const x = r*0.15 + Math.random() * r*0.2;
      const y = (Math.random() - 0.5) * r * 1.2;
      ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI*2); ctx.fill();
    }
  } else if (breadType === 'whole_loaf') {
    // Whole loaf - complete intact loaf
    ctx.fillStyle="#e8b887"; 
    roundedRect(ctx, -r*0.95, -r*0.75, r*1.9, r*1.5, r*0.6);
    ctx.fillStyle="#d4a574"; 
    roundedRect(ctx, -r*0.85, -r*0.65, r*1.7, r*1.1, r*0.5);
    ctx.fillStyle="#c19661"; 
    roundedRect(ctx, -r*0.75, -r*0.55, r*1.5, r*0.7, r*0.4);
  } else if (breadType === 'artisan_loaf') {
    // Artisan loaf
    ctx.fillStyle="#d2b48c"; 
    roundedRect(ctx, -r*0.95, -r*0.8, r*1.9, r*1.6, r*0.5);
    ctx.fillStyle="#c8a882"; 
    roundedRect(ctx, -r*0.85, -r*0.7, r*1.7, r*1.2, r*0.4);
    ctx.fillStyle="#b8860b"; 
    roundedRect(ctx, -r*0.9, -r*0.65, r*1.8, r*0.9, r*0.3);
    // Artisan scoring pattern
    ctx.strokeStyle="#8b7d6b"; ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(-r*0.6, -r*0.3); ctx.lineTo(r*0.6, -r*0.1);
    ctx.moveTo(-r*0.6, r*0.1); ctx.lineTo(r*0.6, r*0.3);
    ctx.stroke();
  } else if (breadType === 'dinner_roll') {
    // Dinner roll - small round bread
    ctx.fillStyle="#f5deb3"; 
    ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#ddd8be"; 
    ctx.beginPath(); ctx.arc(0,0,r*0.7,0,Math.PI*2); ctx.fill();
    // Texture lines
    ctx.strokeStyle="#d2b48c"; ctx.lineWidth=1;
    for(let i = 0; i < 6; i++) {
      const angle = (i * Math.PI / 3);
      ctx.beginPath(); 
      ctx.moveTo(Math.cos(angle) * r*0.3, Math.sin(angle) * r*0.3);
      ctx.lineTo(Math.cos(angle) * r*0.6, Math.sin(angle) * r*0.6);
      ctx.stroke();
    }
  } else if (breadType === 'croissant') {
    // Croissant - proper crescent shaped pastry
    ctx.fillStyle="#f4e4bc"; 
    
    // Draw crescent shape using bezier curves
    ctx.beginPath();
    // Start at top left
    ctx.moveTo(-r*0.8, -r*0.4);
    // Curve around the outer edge
    ctx.quadraticCurveTo(-r*0.3, -r*0.9, r*0.4, -r*0.6);
    ctx.quadraticCurveTo(r*0.9, -r*0.3, r*0.8, r*0.2);
    ctx.quadraticCurveTo(r*0.6, r*0.6, r*0.2, r*0.5);
    // Inner curve to create crescent
    ctx.quadraticCurveTo(r*0.1, r*0.2, -r*0.1, r*0.1);
    ctx.quadraticCurveTo(-r*0.4, -r*0.1, -r*0.6, -r*0.3);
    ctx.quadraticCurveTo(-r*0.7, -r*0.35, -r*0.8, -r*0.4);
    ctx.closePath();
    ctx.fill();
    
    // Golden brown highlights
    ctx.fillStyle="#e6d3a3";
    ctx.beginPath();
    ctx.moveTo(-r*0.6, -r*0.25);
    ctx.quadraticCurveTo(-r*0.2, -r*0.6, r*0.3, -r*0.4);
    ctx.quadraticCurveTo(r*0.6, -r*0.2, r*0.5, r*0.1);
    ctx.quadraticCurveTo(r*0.3, r*0.3, r*0.0, r*0.25);
    ctx.quadraticCurveTo(-r*0.2, r*0.0, -r*0.4, -r*0.15);
    ctx.quadraticCurveTo(-r*0.5, -r*0.2, -r*0.6, -r*0.25);
    ctx.closePath();
    ctx.fill();
    
    // Flaky pastry layers (curved lines following crescent shape)
    ctx.strokeStyle="#d4af37"; 
    ctx.lineWidth=1;
    for(let i = 0; i < 3; i++) {
      ctx.beginPath();
      const offset = i * 0.15;
      ctx.moveTo(-r*(0.6-offset), -r*(0.2-offset*0.5));
      ctx.quadraticCurveTo(-r*(0.1-offset), -r*(0.4-offset), r*(0.2+offset*0.5), -r*(0.25+offset*0.2));
      ctx.quadraticCurveTo(r*(0.4+offset*0.3), -r*(0.1+offset*0.1), r*(0.3+offset*0.2), r*(0.05+offset*0.1));
      ctx.stroke();
    }
    
    // Add some texture dots for flaky appearance
    ctx.fillStyle="#deb887";
    for(let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 1.5 - Math.PI * 0.25;
      const distance = r * (0.3 + Math.random() * 0.4);
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      ctx.beginPath(); 
      ctx.arc(x, y, 0.8, 0, Math.PI*2); 
      ctx.fill();
    }
  } else if (breadType === 'butter') {
    // Butter stick - golden yellow rectangular shape
    ctx.fillStyle="#ffef94"; // Light butter yellow
    roundedRect(ctx, -r*0.8, -r*0.4, r*1.6, r*0.8, r*0.15);
    
    // Darker butter color for shading
    ctx.fillStyle="#ffd966"; 
    roundedRect(ctx, -r*0.75, -r*0.35, r*1.5, r*0.3, r*0.1);
    
    // Wrapper paper ends (white)
    ctx.fillStyle="#f8f8ff";
    roundedRect(ctx, -r*0.85, -r*0.45, r*0.2, r*0.9, r*0.05);
    roundedRect(ctx, r*0.65, -r*0.45, r*0.2, r*0.9, r*0.05);
    
    // Brand text on wrapper
    ctx.fillStyle="#666";
    ctx.font = `${r*0.15}px ui-monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('BUTTER', -r*0.75, -r*0.1);
    ctx.fillText('BUTTER', r*0.75, -r*0.1);
    
    // Shiny highlight
    ctx.fillStyle="#ffffa0";
    roundedRect(ctx, -r*0.6, -r*0.25, r*1.2, r*0.15, r*0.05);
  } else if (breadType.includes('boss')) {
    // Boss breads - larger and more imposing
    const baseColor = breadType.includes('sourdough') ? "#d4b887" : 
                     breadType.includes('french') ? "#e8c5a0" : "#8b4513";
    const accentColor = breadType.includes('sourdough') ? "#c19661" : 
                       breadType.includes('french') ? "#d4b087" : "#a0522d";
    
    ctx.fillStyle = baseColor; 
    roundedRect(ctx, -r*1.2, -r*0.9, r*2.4, r*1.8, r*0.6);
    ctx.fillStyle = accentColor; 
    roundedRect(ctx, -r*1.1, -r*0.8, r*2.2, r*1.4, r*0.5);
    
    // Boss crown/aura effect
    ctx.strokeStyle="#ffd700"; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(0, 0, r*1.3, 0, Math.PI*2); ctx.stroke();
  } else {
    // Default bread slice
    ctx.fillStyle="#c58a55"; 
    roundedRect(ctx, -r*0.875, -r*0.625, r*1.75, r*1.25, r*0.5);
    ctx.fillStyle="#8c5a2f"; 
    roundedRect(ctx, -r*0.875, -r*0.75, r*1.75, r*0.5, r*0.375);
  }
  
  ctx.restore();
}

// Helper function for rounded rectangles
function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

export function createWikiModal(): HTMLElement {
  const modal = document.createElement('div');
  modal.className = 'wiki-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: modalFadeIn 0.3s ease-out;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    background: var(--panel);
    border: 1px solid #29293f;
    border-radius: 16px;
    width: 90%;
    max-width: 900px;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  `;

  const header = document.createElement('div');
  header.style.cssText = `
    background: var(--panel2);
    padding: 20px;
    border-bottom: 1px solid #29293f;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

  const title = document.createElement('h2');
  title.style.cssText = `
    margin: 0;
    color: var(--accent);
    font-size: 1.8rem;
    font-weight: 900;
  `;
  title.textContent = '📚 Loaf Encyclopedia';

  const closeBtn = document.createElement('button');
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: var(--muted);
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
  `;
  closeBtn.textContent = '×';
  closeBtn.onmouseover = () => {
    closeBtn.style.background = 'var(--bad)';
    closeBtn.style.color = 'white';
  };
  closeBtn.onmouseout = () => {
    closeBtn.style.background = 'none';
    closeBtn.style.color = 'var(--muted)';
  };

  const body = document.createElement('div');
  body.style.cssText = `
    padding: 20px;
    overflow-y: auto;
    max-height: calc(80vh - 80px);
  `;

  // Create bread entries
  BREAD_ENCYCLOPEDIA.forEach(bread => {
    const entry = document.createElement('div');
    entry.style.cssText = `
      background: var(--panel2);
      border: 1px solid #2d2d45;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
      transition: all 0.2s ease;
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 16px;
      align-items: start;
    `;
    entry.onmouseover = () => {
      entry.style.borderColor = 'var(--accent)';
      entry.style.transform = 'translateY(-2px)';
    };
    entry.onmouseout = () => {
      entry.style.borderColor = '#2d2d45';
      entry.style.transform = 'translateY(0)';
    };

    // Create canvas for bread art
    const artCanvas = document.createElement('canvas');
    artCanvas.width = 80;
    artCanvas.height = 80;
    artCanvas.style.cssText = `
      border: 2px solid var(--wire);
      border-radius: 8px;
      background: var(--bg);
    `;
    const artCtx = artCanvas.getContext('2d');
    artCtx.translate(40, 40);
    drawBreadArt(artCtx, bread.key, 60);

    // Create info section
    const infoDiv = document.createElement('div');
    
    const rarityColors = {
      'Common': '#a1a1b3',
      'Uncommon': '#7bd88f', 
      'Rare': '#ffb347',
      'Epic': '#a855f7',
      'Boss': '#ff6b6b'
    };

    infoDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <h3 style="margin: 0; color: var(--text); font-size: 1.3rem; font-weight: 700;">${bread.name}</h3>
        <span style="
          background: ${rarityColors[bread.rarity]}20;
          color: ${rarityColors[bread.rarity]};
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        ">${bread.rarity}</span>
      </div>
      
      <p style="color: var(--muted); margin: 0 0 12px 0; line-height: 1.5; font-size: 0.95rem;">${bread.description}</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; margin-bottom: 12px;">
        <div style="background: var(--bg); padding: 8px; border-radius: 6px;">
          <div style="color: var(--muted); font-size: 0.8rem; margin-bottom: 2px;">Base Health</div>
          <div style="color: var(--bad); font-weight: 700; font-size: 1.1rem;">${bread.baseHealth}</div>
          ${bread.healthFormula ? `<div style="color: var(--muted); font-size: 0.7rem;">${bread.healthFormula}</div>` : ''}
        </div>
        <div style="background: var(--bg); padding: 8px; border-radius: 6px;">
          <div style="color: var(--muted); font-size: 0.8rem; margin-bottom: 2px;">Base Speed</div>
          <div style="color: var(--accent); font-weight: 700; font-size: 1.1rem;">${bread.baseSpeed}</div>
          ${bread.speedFormula ? `<div style="color: var(--muted); font-size: 0.7rem;">${bread.speedFormula}</div>` : ''}
        </div>
        <div style="background: var(--bg); padding: 8px; border-radius: 6px;">
          <div style="color: var(--muted); font-size: 0.8rem; margin-bottom: 2px;">Bounty</div>
          <div style="color: var(--good); font-weight: 700; font-size: 1.1rem;">${bread.baseBounty} coins</div>
        </div>
        <div style="background: var(--bg); padding: 8px; border-radius: 6px;">
          <div style="color: var(--muted); font-size: 0.8rem; margin-bottom: 2px;">First Appears</div>
          <div style="color: var(--text); font-weight: 700; font-size: 1.1rem;">Wave ${bread.firstAppears}</div>
        </div>
      </div>
      
      ${bread.abilities ? `
        <div style="margin-bottom: 10px;">
          <div style="color: var(--accent2); font-weight: 600; font-size: 0.9rem; margin-bottom: 4px;">🔮 Special Abilities</div>
          ${bread.abilities.map(ability => `
            <div style="background: var(--accent)15; padding: 6px 8px; border-radius: 4px; margin: 2px 0; font-size: 0.85rem; color: var(--text);">
              ${ability}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <div style="margin-bottom: 10px;">
        <div style="color: var(--bad); font-weight: 600; font-size: 0.9rem; margin-bottom: 4px;">🎯 Weaknesses</div>
        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
          ${bread.weaknesses.map(weakness => `
            <span style="background: var(--bad)15; color: var(--bad); padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">
              ${weakness}
            </span>
          `).join('')}
        </div>
      </div>
      
      ${bread.resistances ? `
        <div>
          <div style="color: var(--wire); font-weight: 600; font-size: 0.9rem; margin-bottom: 4px;">🛡️ Resistances</div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${Object.entries(bread.resistances).map(([type, value]) => `
              <span style="background: var(--wire)15; color: var(--wire); padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">
                ${type}: ${Math.round(value * 100)}% reduction
              </span>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;

    entry.appendChild(artCanvas);
    entry.appendChild(infoDiv);
    body.appendChild(entry);
  });

  // Close modal when clicking outside or on close button
  closeBtn.onclick = () => {
    if (modal.parentNode) {
      document.body.removeChild(modal);
    }
  };
  modal.onclick = (e) => {
    if (e.target === modal && modal.parentNode) {
      document.body.removeChild(modal);
    }
  };

  header.appendChild(title);
  header.appendChild(closeBtn);
  content.appendChild(header);
  content.appendChild(body);
  modal.appendChild(content);

  return modal;
}