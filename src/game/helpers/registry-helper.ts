import { Game } from "phaser";

export const isDebugMode = (game: Game): boolean => {
  return getBooleanValueFromRegistry(game, "debugMode");
};

export const isAutoAttackEnabled = (game: Game): boolean => {
  return getBooleanValueFromRegistry(game, "autoAttack");
};

export const isEasyMode = (game: Game): boolean => {
  return getBooleanValueFromRegistry(game, "easyMode");
};

export const isRapidLevelUp = (game: Game): boolean => {
  return getBooleanValueFromRegistry(game, "rapidLevelUp");
};

export const isAutoEnterPortal = (game: Game): boolean => {
  return getBooleanValueFromRegistry(game, "autoEnterPortal");
};

export const isMultipleResourceDropsEnabled = (game: Game): boolean => {
  return getBooleanValueFromRegistry(game, "multipleResourceDrops");
};

const getBooleanValueFromRegistry = (game: Game, field: string): boolean => {
  return game.registry.get(field) == "true";
};
