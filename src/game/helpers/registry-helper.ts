import {Game} from 'phaser';

export const isDebugMode = (game: Game): boolean => {
    return game.registry.get('debugMode') == 'true'
}

export const isAutoAttackEnabled = (game: Game): boolean => {
    return game.registry.get('autoAttack') == 'true'
}