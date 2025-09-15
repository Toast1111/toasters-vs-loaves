# UI Components

This folder contains the modular UI system for the Toasters vs Loaves game. The UI has been refactored from a single large file into focused, maintainable components.

## Structure

- **`index.ts`** - Main UI manager that coordinates all components
- **`gameInfo.ts`** - Game state display (coins, lives, wave, AP)
- **`towerCatalog.ts`** - Tower selection and placement interface
- **`towerInspect.ts`** - Selected tower details and upgrade interface
- **`techTree.ts`** - Technology research interface
- **`abilities.ts`** - Special abilities display and management
- **`achievements.ts`** - Achievements display
- **`powerups.ts`** - Active powerups display
- **`eventLog.ts`** - Game event logging
- **`floatingText.ts`** - Damage numbers and floating text

## Usage

The main UI is imported through `ui.ts` which re-exports the modular system for backward compatibility:

```typescript
import { UI } from "./ui";

// Initialize the UI system
UI.bind(game);

// Update displays
UI.sync(game);

// Log messages
UI.log("Message");

// Create floating text
UI.float(game, x, y, "text", isBad);
```

## Benefits

- **Modularity**: Each component has a single responsibility
- **Maintainability**: Easier to find and modify specific UI functionality
- **Testability**: Components can be tested in isolation
- **Reusability**: Components can be reused in different contexts
- **Organization**: Clear folder structure for better navigation

## Inter-component Communication

Components communicate through the main UI manager using callback functions to avoid circular dependencies. This ensures clean separation of concerns while maintaining functionality.