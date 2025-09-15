// @ts-nocheck
import { achievements, getAchievementProgress } from "../achievements";

/**
 * Achievements component - handles achievements display
 */
export const AchievementsUI = {
  /**
   * Initialize the achievements component
   */
  init(game: any) {
    this.refresh();
  },

  /**
   * Refresh the achievements display with current progress
   */
  refresh() {
    const display = document.getElementById('achievementsDisplay');
    if (!display) return;

    const progress = getAchievementProgress();
    
    let html = `<div class="hint">Achievements: ${progress.unlocked}/${progress.total} (${progress.percentage}%)</div>`;
    
    for (const achievement of achievements) {
      html += this.buildAchievementDisplay(achievement);
    }
    
    display.innerHTML = html;
  },

  /**
   * Build the display for a single achievement
   */
  buildAchievementDisplay(achievement: any): string {
    const statusClass = achievement.unlocked ? 'unlocked' : 'locked';
    
    return `
      <div class="achievement ${statusClass}">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-text">
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-desc">${achievement.description}</div>
        </div>
      </div>
    `;
  }
};