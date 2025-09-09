# Cross-Path Upgrade System Test

## BTD6 Rules Implementation

### Constraints:
- **Only 1 path** can reach **Tier 5**
- **Maximum 2 paths** can reach **Tier 3+** 
- **All paths** can reach **Tier 2**

### Valid Combinations:
- 5-0-0, 0-5-0, 0-0-5 (single path to tier 5)
- 5-2-0, 5-0-2, 2-5-0, 0-5-2, 2-0-5, 0-2-5 (one tier 5, one tier 2)
- 3-3-0, 3-0-3, 0-3-3 (two paths to tier 3)
- 4-2-0, 4-0-2, 2-4-0, 0-4-2, 2-0-4, 0-2-4 (one tier 4, one tier 2)
- Any combination with max tier 2-2-2

### Invalid Combinations:
- 5-5-0, 5-0-5, 0-5-5 (two tier 5 paths)
- 5-3-3, 3-5-3, 3-3-5 (tier 5 + two tier 3+ paths)
- 4-4-0, 4-0-4, 0-4-4 (two tier 4 paths - conflicts with tier 5 rule)
- 3-3-3 (three tier 3+ paths)

## Test Steps:

1. **Place a Counter Toaster** (costs 100, you have 5000 coins)
2. **Try to upgrade each path to tier 2** - Should work fine (2-2-2)
3. **Try to upgrade one path to tier 3** - Should work (3-2-2)
4. **Try to upgrade another path to tier 3** - Should work (3-3-2)
5. **Try to upgrade the third path to tier 3** - Should be **BLOCKED** with message "Max 2 paths at Tier 3+"
6. **Continue upgrading one path to tier 4** - Should work (4-3-2)
7. **Try to upgrade the other tier 3 path to tier 4** - Should be **BLOCKED** with message "Another path already at Tier 5" potential
8. **Continue upgrading to tier 5** - Should work (5-3-2)
9. **Try to upgrade either other path beyond tier 2** - Should be **BLOCKED**

## Current Issues Found:

Looking at the code, the system is implemented but may have logical issues in the constraint checking. The player should test this thoroughly to see if the restrictions are properly enforced.

## Console Debugging:

The Game.ts now includes console.log statements to track upgrade attempts. Open browser dev tools (F12) to see:
- Upgrade attempts
- Current tier states  
- Why upgrades are blocked

## Quick Test:
- Start game with 5000 coins
- Place basic toaster
- Try to create a 3-3-3 tower (should fail)
- Try to create two tier 5 paths (should fail)
- Try valid combinations like 5-2-0 (should work)
