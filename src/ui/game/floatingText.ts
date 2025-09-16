// @ts-nocheck

/**
 * Floating text component - handles damage numbers and other floating text
 */
export const FloatingTextUI = {
  /**
   * Initialize the floating text component
   */
  init(game: any) {
    // No special initialization needed
  },

  /**
   * Create floating text at specified coordinates
   */
  float(game: any, x: number, y: number, str: string, isBad: boolean = false) {
    if (!game || !game.state || !game.state.texts) return;
    
    game.state.texts.push({
      x: x,
      y: y,
      str: str,
      isBad: isBad,
      t: 0
    });
  },

  /**
   * Create floating damage text
   */
  floatDamage(game: any, x: number, y: number, damage: number) {
    this.float(game, x, y, `-${damage}`, false);
  },

  /**
   * Create floating heal text
   */
  floatHeal(game: any, x: number, y: number, heal: number) {
    this.float(game, x, y, `+${heal}`, false);
  },

  /**
   * Create floating error text
   */
  floatError(game: any, x: number, y: number, message: string) {
    this.float(game, x, y, message, true);
  },

  /**
   * Create floating coins text
   */
  floatCoins(game: any, x: number, y: number, coins: number) {
    this.float(game, x, y, `+${coins}c`, false);
  }
};