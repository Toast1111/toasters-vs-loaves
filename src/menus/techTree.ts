// @ts-nocheck

export interface GlobalTech {
  id: string;
  name: string;
  description: string;
  effect: string;
  cost: number;
  maxLevel: number;
  category: 'Damage' | 'Range' | 'Speed' | 'Special' | 'Economic';
  unlocked: boolean;
  currentLevel: number;
}

export const GLOBAL_TECH_TREE: GlobalTech[] = [
  // Damage Category
  {
    id: 'heat_intensifier',
    name: 'Heat Intensifier',
    description: 'Boost the damage output of all toasters',
    effect: '+5% damage per level',
    cost: 50,
    maxLevel: 10,
    category: 'Damage',
    unlocked: true,
    currentLevel: 0
  },
  {
    id: 'tungsten_elements',
    name: 'Tungsten Elements',
    description: 'Premium heating elements for superior toasting',
    effect: '+10% damage, unlocks at level 5 Heat Intensifier',
    cost: 150,
    maxLevel: 5,
    category: 'Damage',
    unlocked: false,
    currentLevel: 0
  },
  
  // Range Category
  {
    id: 'range_extender',
    name: 'Range Extender',
    description: 'Increase detection range of all appliances',
    effect: '+8% range per level',
    cost: 40,
    maxLevel: 8,
    category: 'Range',
    unlocked: true,
    currentLevel: 0
  },
  {
    id: 'thermal_optics',
    name: 'Thermal Optics',
    description: 'Advanced targeting systems for long-range toasting',
    effect: '+15% range, +5% accuracy',
    cost: 200,
    maxLevel: 3,
    category: 'Range',
    unlocked: false,
    currentLevel: 0
  },
  
  // Speed Category
  {
    id: 'quick_toast',
    name: 'Quick Toast',
    description: 'Reduce toasting time for faster bread elimination',
    effect: '+6% fire rate per level',
    cost: 60,
    maxLevel: 8,
    category: 'Speed',
    unlocked: true,
    currentLevel: 0
  },
  {
    id: 'auto_loader',
    name: 'Auto Loader',
    description: 'Automated bread feeding systems',
    effect: '+20% fire rate, +1 target capacity',
    cost: 250,
    maxLevel: 3,
    category: 'Speed',
    unlocked: false,
    currentLevel: 0
  },
  
  // Special Category
  {
    id: 'multi_slice',
    name: 'Multi-Slice Technology',
    description: 'Allow toasters to target multiple bread slices',
    effect: '+1 piercing per level (max 3)',
    cost: 100,
    maxLevel: 3,
    category: 'Special',
    unlocked: false,
    currentLevel: 0
  },
  {
    id: 'crumb_collection',
    name: 'Crumb Collection System',
    description: 'Gather crumbs for bonus resources',
    effect: '+10% coin gain per level',
    cost: 80,
    maxLevel: 5,
    category: 'Economic',
    unlocked: true,
    currentLevel: 0
  },
  {
    id: 'smart_grid',
    name: 'Smart Power Grid',
    description: 'Networked appliances share power efficiently',
    effect: 'Adjacent toasters gain +15% stats',
    cost: 300,
    maxLevel: 1,
    category: 'Special',
    unlocked: false,
    currentLevel: 0
  }
];

export function createTechModal(): HTMLElement {
  const modal = document.createElement('div');
  modal.className = 'tech-modal';
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
  title.textContent = '🔬 Global Tech Tree';

  const apDisplay = document.createElement('div');
  apDisplay.style.cssText = `
    color: var(--accent);
    font-weight: 600;
    font-size: 1.1rem;
  `;
  apDisplay.textContent = 'Available AP: 0';

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

  const categoryColors = {
    'Damage': '#ff6b6b',
    'Range': '#7bd88f', 
    'Speed': '#ffb347',
    'Special': '#a855f7',
    'Economic': '#ffd166'
  };

  // Group technologies by category
  const categories = [...new Set(GLOBAL_TECH_TREE.map(tech => tech.category))];
  
  categories.forEach(category => {
    const categorySection = document.createElement('div');
    categorySection.style.cssText = `
      margin-bottom: 30px;
    `;

    const categoryHeader = document.createElement('h3');
    categoryHeader.style.cssText = `
      margin: 0 0 16px 0;
      color: ${categoryColors[category]};
      font-size: 1.4rem;
      font-weight: 700;
      border-bottom: 2px solid ${categoryColors[category]}40;
      padding-bottom: 8px;
    `;
    categoryHeader.textContent = `${category} Technologies`;

    const techGrid = document.createElement('div');
    techGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    `;

    const techs = GLOBAL_TECH_TREE.filter(tech => tech.category === category);
    techs.forEach(tech => {
      const techCard = document.createElement('div');
      techCard.style.cssText = `
        background: var(--panel2);
        border: 1px solid #2d2d45;
        border-radius: 12px;
        padding: 16px;
        transition: all 0.2s ease;
        ${tech.unlocked ? 'opacity: 1;' : 'opacity: 0.6;'}
        ${tech.unlocked ? 'cursor: pointer;' : 'cursor: not-allowed;'}
      `;

      if (tech.unlocked) {
        techCard.onmouseover = () => {
          techCard.style.borderColor = categoryColors[category];
          techCard.style.transform = 'translateY(-2px)';
        };
        techCard.onmouseout = () => {
          techCard.style.borderColor = '#2d2d45';
          techCard.style.transform = 'translateY(0)';
        };
      }

      const isMaxed = tech.currentLevel >= tech.maxLevel;
      const nextLevelCost = tech.cost * (tech.currentLevel + 1);

      techCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <h4 style="margin: 0; color: var(--text); font-size: 1.2rem; font-weight: 700;">${tech.name}</h4>
          <span style="
            background: ${categoryColors[category]}20;
            color: ${categoryColors[category]};
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 600;
          ">${tech.category}</span>
        </div>
        
        <p style="color: var(--muted); margin: 0 0 12px 0; line-height: 1.4; font-size: 0.95rem;">${tech.description}</p>
        
        <div style="
          background: var(--panel);
          border: 1px solid #29293f;
          border-radius: 8px;
          padding: 8px;
          margin-bottom: 12px;
          font-size: 0.9rem;
        ">
          <span style="color: var(--good); font-weight: 600;">Effect:</span>
          <span style="color: var(--text); margin-left: 8px;">${tech.effect}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="color: var(--muted); font-size: 0.9rem;">Level:</span>
            <span style="color: var(--accent); font-weight: 600; margin-left: 4px;">${tech.currentLevel}/${tech.maxLevel}</span>
          </div>
          
          ${isMaxed ? 
            `<span style="
              background: var(--good)20;
              color: var(--good);
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 0.9rem;
              font-weight: 600;
            ">MAXED</span>` :
            tech.unlocked ?
              `<button style="
                background: linear-gradient(135deg, ${categoryColors[category]}, ${categoryColors[category]}dd);
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 0.9rem;
              " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                Upgrade (${nextLevelCost} AP)
              </button>` :
              `<span style="
                background: #2d3748;
                color: var(--muted);
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 0.9rem;
              ">LOCKED</span>`
          }
        </div>
      `;

      techGrid.appendChild(techCard);
    });

    categorySection.appendChild(categoryHeader);
    categorySection.appendChild(techGrid);
    body.appendChild(categorySection);
  });

  closeBtn.onclick = () => {
    document.body.removeChild(modal);
  };

  modal.onclick = (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  };

  const headerContent = document.createElement('div');
  headerContent.style.cssText = `
    display: flex;
    align-items: center;
    gap: 20px;
  `;
  headerContent.appendChild(title);
  headerContent.appendChild(apDisplay);

  header.appendChild(headerContent);
  header.appendChild(closeBtn);
  content.appendChild(header);
  content.appendChild(body);
  modal.appendChild(content);

  return modal;
}