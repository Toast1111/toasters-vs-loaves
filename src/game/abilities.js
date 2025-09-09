// @ts-nocheck
export const specialAbilities = {
    LIGHTNING_STRIKE: {
        name: 'Lightning Strike',
        hotkey: 'Q',
        cooldown: 15,
        cost: 100,
        description: 'Strikes all enemies with lightning, dealing massive damage',
        currentCooldown: 0,
        effect: (game) => {
            import('./breads').then(({ breads, damageBread }) => {
                import('./effects').then(({ addScreenShake }) => {
                    let hitCount = 0;
                    for (const bread of breads) {
                        if (bread.alive) {
                            damageBread(bread, 150, game.state);
                            hitCount++;
                        }
                    }
                    addScreenShake(10, 0.8);
                    import('./ui').then(({ UI }) => {
                        UI.log(`⚡ Lightning Strike hit ${hitCount} enemies!`);
                    });
                });
            });
        }
    },
    HEAT_WAVE: {
        name: 'Heat Wave',
        hotkey: 'W',
        cooldown: 20,
        cost: 150,
        description: 'Creates heat zones at all enemy positions',
        currentCooldown: 0,
        effect: (game) => {
            import('./breads').then(({ breads }) => {
                import('./effects').then(({ createHeatZone, addScreenShake }) => {
                    let zoneCount = 0;
                    for (const bread of breads) {
                        if (bread.alive) {
                            createHeatZone(bread.x, bread.y, 60, 12, 4);
                            zoneCount++;
                        }
                    }
                    addScreenShake(6, 0.4);
                    import('./ui').then(({ UI }) => {
                        UI.log(`🔥 Heat Wave created ${zoneCount} burning zones!`);
                    });
                });
            });
        }
    },
    REPAIR_ALL: {
        name: 'Repair All',
        hotkey: 'E',
        cooldown: 25,
        cost: 200,
        description: 'Instantly repairs 50 lives and gives temporary invulnerability',
        currentCooldown: 0,
        effect: (game) => {
            game.state.lives = Math.min(100, game.state.lives + 50);
            game.state._invulnerable = true;
            setTimeout(() => {
                game.state._invulnerable = false;
            }, 5000);
            import('./ui').then(({ UI }) => {
                UI.log(`💚 Repaired 50 lives + 5s invulnerability!`);
                UI.sync(game);
            });
            import('./effects').then(({ addScreenShake }) => {
                addScreenShake(4, 0.3);
            });
        }
    },
    EMERGENCY_COINS: {
        name: 'Emergency Coins',
        hotkey: 'R',
        cooldown: 30,
        cost: 0, // Free but long cooldown
        description: 'Grants emergency coins based on current wave',
        currentCooldown: 0,
        effect: (game) => {
            const bonus = 200 + game.state.wave * 25;
            game.state.coins += bonus;
            import('./ui').then(({ UI }) => {
                UI.log(`💰 Emergency funds: +${bonus} coins!`);
                UI.sync(game);
            });
            import('./effects').then(({ addScreenShake }) => {
                addScreenShake(3, 0.2);
            });
        }
    }
};
export function stepAbilities(dt) {
    let needsUpdate = false;
    for (const ability of Object.values(specialAbilities)) {
        if (ability.currentCooldown > 0) {
            const oldCooldown = ability.currentCooldown;
            ability.currentCooldown -= dt;
            if (ability.currentCooldown < 0)
                ability.currentCooldown = 0;
            if (Math.floor(oldCooldown) !== Math.floor(ability.currentCooldown)) {
                needsUpdate = true;
            }
        }
    }
    if (needsUpdate) {
        import('./ui').then(({ UI }) => {
            UI.refreshAbilities();
        });
    }
}
export function tryActivateAbility(key, game) {
    for (const ability of Object.values(specialAbilities)) {
        if (ability.hotkey.toLowerCase() === key.toLowerCase()) {
            if (ability.currentCooldown > 0) {
                import('./ui').then(({ UI }) => {
                    UI.log(`${ability.name} on cooldown (${Math.ceil(ability.currentCooldown)}s)`);
                });
                return false;
            }
            if (game.state.coins < ability.cost) {
                import('./ui').then(({ UI }) => {
                    UI.log(`Not enough coins for ${ability.name} (need ${ability.cost})`);
                });
                return false;
            }
            game.state.coins -= ability.cost;
            ability.currentCooldown = ability.cooldown;
            ability.effect(game);
            // Record ability usage for achievements
            import('./achievements').then(({ recordAbilityUsed }) => {
                recordAbilityUsed(key);
            });
            import('./ui').then(({ UI }) => {
                UI.sync(game);
            });
            return true;
        }
    }
    return false;
}
export function getAbilityStatus() {
    return Object.entries(specialAbilities).map(([key, ability]) => ({
        key,
        name: ability.name,
        hotkey: ability.hotkey,
        cooldown: ability.currentCooldown,
        maxCooldown: ability.cooldown,
        cost: ability.cost,
        description: ability.description,
        ready: ability.currentCooldown === 0
    }));
}
//I hate Gerald for real for real
