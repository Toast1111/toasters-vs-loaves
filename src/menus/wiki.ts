// @ts-nocheck

export interface BreadType {
  name: string;
  health: number;
  speed: number;
  reward: number;
  description: string;
  weaknesses: string[];
  abilities?: string[];
  element: 'Normal' | 'Uncommon' | 'Rare' | 'Epic' | 'Fire';
}

export const BREAD_ENCYCLOPEDIA: BreadType[] = [
  {
    name: 'White Bread',
    health: 10,
    speed: 1.0,
    reward: 2,
    description: 'The most basic loaf. Soft, squishy, and easy to toast.',
    weaknesses: ['Heat', 'All toaster types'],
    element: 'Normal'
  },
  {
    name: 'Whole Wheat',
    health: 15,
    speed: 0.9,
    reward: 3,
    description: 'Slightly tougher than white bread with more fiber.',
    weaknesses: ['High heat', 'Convection'],
    element: 'Normal'
  },
  {
    name: 'Sourdough',
    health: 25,
    speed: 0.8,
    reward: 5,
    description: 'Tanky and acidic. Requires sustained heat to defeat.',
    weaknesses: ['Extended toasting', 'Industrial toasters'],
    abilities: ['Acid Resistance - takes 25% less damage from basic toasters'],
    element: 'Uncommon'
  },
  {
    name: 'Baguette',
    health: 20,
    speed: 1.5,
    reward: 4,
    description: 'Fast and crispy. Hard to hit but fragile when caught.',
    weaknesses: ['Quick bursts', 'Microwave towers'],
    abilities: ['Speed Boost - moves 50% faster than normal'],
    element: 'Uncommon'
  },
  {
    name: 'Pumpernickel',
    health: 35,
    speed: 0.7,
    reward: 8,
    description: 'Dense, dark, and incredibly resilient to heat.',
    weaknesses: ['Sustained high heat', 'Chef-class toasters'],
    abilities: ['Heat Resistance - immune to low-tier toaster damage'],
    rarity: 'Rare'
  },
  {
    name: 'Croissant',
    health: 15,
    speed: 1.2,
    reward: 6,
    description: 'Buttery and flaky. Splits into smaller pieces when damaged.',
    weaknesses: ['Area damage', 'Air fryer towers'],
    abilities: ['Split - breaks into 2 smaller croissants at 50% health'],
    element: 'Rare'
  },
  {
    name: 'Ancient Grain',
    health: 50,
    speed: 0.6,
    reward: 12,
    description: 'Prehistoric bread with mysterious powers.',
    weaknesses: ['Modern toaster tech', 'High-tier upgrades'],
    abilities: ['Ancient Shield - 50% damage reduction', 'Regeneration - heals 1 HP per second'],
    element: 'Epic'
  },
  {
    name: 'The Chosen Loaf',
    health: 100,
    speed: 1.0,
    reward: 25,
    description: 'The ultimate bread. Said to be untoastable by mortal ovens.',
    weaknesses: ['Perfect timing', 'Legendary toaster combinations'],
    abilities: ['Divine Protection - immunity to single-target damage', 'Bread Blessing - heals nearby loaves'],
    element: 'Fire'
  }
];

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
    max-width: 800px;
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
    `;
    entry.onmouseover = () => {
      entry.style.borderColor = 'var(--accent)';
      entry.style.transform = 'translateY(-2px)';
    };
    entry.onmouseout = () => {
      entry.style.borderColor = '#2d2d45';
      entry.style.transform = 'translateY(0)';
    };

    const ElementColor = {
      'Normal': '#a1a1b3',
      'Uncommon': '#7bd88f',
      'Rare': '#ffb347',
      'Epic': '#a855f7',
      'Fire': '#ff6b6b'
    };

    entry.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <h3 style="margin: 0; color: var(--text); font-size: 1.3rem; font-weight: 700;">${bread.name}</h3>
        <span style="
          background: ${ElementColor[bread.element]}20;
          color: ${ElementColor[bread.element]};
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        ">${bread.element}</span>
      </div>
      
      <p style="color: var(--muted); margin: 0 0 12px 0; line-height: 1.5;">${bread.description}</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin-bottom: 12px;">
        <div>
          <span style="color: var(--muted); font-size: 0.9rem;">Health:</span>
          <span style="color: var(--bad); font-weight: 600; margin-left: 4px;">${bread.health}</span>
        </div>
        <div>
          <span style="color: var(--muted); font-size: 0.9rem;">Speed:</span>
          <span style="color: var(--accent); font-weight: 600; margin-left: 4px;">${bread.speed}x</span>
        </div>
        <div>
          <span style="color: var(--muted); font-size: 0.9rem;">Reward:</span>
          <span style="color: var(--good); font-weight: 600; margin-left: 4px;">${bread.reward} coins</span>
        </div>
      </div>
      
      <div style="margin-bottom: 8px;">
        <span style="color: var(--muted); font-size: 0.9rem; font-weight: 600;">Weaknesses:</span>
        <div style="margin-top: 4px;">
          ${bread.weaknesses.map(weakness => 
            `<span style="
              background: var(--bad)20;
              color: var(--bad);
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 0.8rem;
              margin-right: 4px;
              display: inline-block;
              margin-bottom: 4px;
            ">${weakness}</span>`
          ).join('')}
        </div>
      </div>
      
      ${bread.abilities ? `
        <div>
          <span style="color: var(--muted); font-size: 0.9rem; font-weight: 600;">Special Abilities:</span>
          <div style="margin-top: 4px;">
            ${bread.abilities.map(ability => 
              `<div style="
                background: var(--accent)20;
                color: var(--accent);
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 0.85rem;
                margin-bottom: 4px;
                border-left: 3px solid var(--accent);
              ">${ability}</div>`
            ).join('')}
          </div>
        </div>
      ` : ''}
    `;

    body.appendChild(entry);
  });

  closeBtn.onclick = () => {
    document.body.removeChild(modal);
  };

  modal.onclick = (e) => {
    if (e.target === modal) {
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