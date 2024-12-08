import {Game} from 'phaser';

export const isDebugMode = (game: Game): boolean => {
    return getBooleanValueFromRegistry(game, 'debugMode');
}

export const isAutoAttackEnabled = (game: Game): boolean => {
    return getBooleanValueFromRegistry(game, 'autoAttack');
}

export const isEasyMode = (game: Game): boolean => {
    return getBooleanValueFromRegistry(game, 'easyMode');
}

const getBooleanValueFromRegistry = (game: Game, field: string): boolean => {
    return game.registry.get(field) == 'true';
}
