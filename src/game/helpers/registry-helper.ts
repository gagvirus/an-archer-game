import { game } from "./accessors.ts";

import { HeroClass } from "./hero-manager.ts";

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

export const getSelectedHeroClass = (): HeroClass => {
  return game().registry.get("selectedHero");
};

export const setSelectedHeroClass = (heroClass: HeroClass): void => {
  game().registry.set("selectedHero", heroClass);
  localStorage.setItem("selectedHero", heroClass);
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
  // get selected hero from localStorage, fallback to default if nothing is selected
  game().registry.set(
    "selectedHero",
    localStorage.getItem("selectedHero") ?? HeroClass.default,
  );
};

const getBooleanValueFromRegistry = (field: string): boolean => {
  return game().registry.get(field) == "true";
};

export const setBooleanValueToRegistry = (
  settingKey: string,
  value: boolean,
): void => {
  localStorage.setItem(settingKey, value.toString());
  game().registry.set(settingKey, value.toString());
};
