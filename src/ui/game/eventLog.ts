// @ts-nocheck

/**
 * Event log component - handles game event logging
 */
export const EventLogUI = {
  /**
   * Initialize the event log component
   */
  init(game: any) {
    // No special initialization needed
  },

  /**
   * Log a message to the event log
   */
  log(msg: string) {
    const el = document.getElementById('log');
    if (!el) return;

    // Check if we should auto-scroll (user is at bottom)
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
    
    // Add the new message
    el.insertAdjacentHTML('beforeend', `<div>• ${msg}</div>`);
    
    // Auto-scroll if user was at bottom
    if (atBottom) {
      el.scrollTop = el.scrollHeight;
    }
  },

  /**
   * Clear the event log
   */
  clear() {
    const el = document.getElementById('log');
    if (el) {
      el.innerHTML = '';
    }
  }
};