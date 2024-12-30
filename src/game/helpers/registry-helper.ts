import { game } from "./accessors.ts";

export const isDebugMode = (): boolean => {
  return getBooleanValueFromRegistry("debugMode");
};

export const isAutoAttackEnabled = (): boolean => {
  return getBooleanValueFromRegistry("autoAttack");
};

export const isEasyMode = (): boolean => {
  return getBooleanValueFromRegistry("easyMode");
};

export const isRapidLevelUp = (): boolean => {
  return getBooleanValueFromRegistry("rapidLevelUp");
};

export const isAutoEnterPortal = (): boolean => {
  return getBooleanValueFromRegistry("autoEnterPortal");
};

export const isMultipleResourceDropsEnabled = (): boolean => {
  return getBooleanValueFromRegistry("multipleResourceDrops");
};

export const initRegistry = (): void => {
  const booleanSettings = [
    "debugMode",
    "autoAttack",
    "easyMode",
    "rapidLevelUp",
    "autoEnterPortal",
    "multipleResourceDrops",
  ];
  booleanSettings.forEach((key) => {
    game().registry.set(key, localStorage.getItem(key));
  });
};

const getBooleanValueFromRegistry = (field: string): boolean => {
  return game().registry.get(field) == "true";
};
