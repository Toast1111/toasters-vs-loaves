# Cross-Path Upgrade System Test

## BTD6 Rules Implementation

### Constraints

- **All paths** can reach **Tier 2**
- **Only 1 path** can reach **Tiers 3, 4, and 5**

### Valid Combinations

- 3-2-2, 4-2-2, 5-2-2 (only one path above Tier 2)
- 2-2-2 and any arrangement where exactly one path is > 2

### Invalid Combinations

- 3-3-0, 3-0-3, 0-3-3 (two paths above Tier 2)
- 4-3-0, 4-0-3, 3-4-0, 0-4-3, 3-0-4, 0-3-4 (two paths above Tier 2)
- 5-3-3, 5-4-2, 4-4-4 (any case with more than one path above Tier 2)

## Test Steps

1. **Place a Counter Toaster** (costs 100, you have 5000 coins)
2. **Try to upgrade each path to tier 2** - Should work fine (2-2-2)
3. **Try to upgrade one path to tier 3** - Should work (3-2-2)
4. **Try to upgrade another path to tier 3** - Should work (3-3-2)
5. **Try to upgrade the third path to tier 3** - Should be **BLOCKED** (only one path can exceed Tier 2)
6. **Continue upgrading the chosen path to tier 4** - Should work (4-2-2)
7. **Try to upgrade another path to tier 3** - Should be **BLOCKED**
8. **Continue upgrading to tier 5** on the chosen path - Should work (5-2-2)
9. **Try to upgrade any other path beyond tier 2** - Should be **BLOCKED**

## Current Notes

The code now enforces only the two rules above. Please test combinations to confirm that only a single Tier 5 is permitted while all other tiers are unrestricted.

## Console Debugging

The Game.ts now includes console.log statements to track upgrade attempts. Open browser dev tools (F12) to see:

- Upgrade attempts
- Current tier states  
- Why upgrades are blocked

## Quick Test

- Start game with 5000 coins
- Place basic toaster
- Try to create a 3-3-0 tower (should fail)
- Try to push one path to 5 and keep others at 2 (should work: 5-2-2)
- Try to push a second path to 3 (should fail)
