export type Attributes = {
  // easyModeModifier: number;
  dexterity: number;
  agility: number;
  perception: number;
  strength: number;
  fortitude: number;
  endurance: number;
  intelligence: number;
  charisma: number;
  luck: number;
  baseAttackTime: number;
  damageMultiplier: number;
  attackSpeedBonus: number;
  evadeChancePercent: number;
  maxHealthMultiplier: number;
  xpGainMultiplier: number;
  dropChanceModifier: number;
  dropAmountModifier: number;
  healthRegenPerInterval: number;
  healthRegenerationInterval: number;
  criticalChancePercent: number;
  criticalExtraDamageMultiplier: number;
  armorRatingBonus: number;
  armorRating: number;
  flatDamageReduction: number;
  percentReduction: number;
  attackRate: number;
  attacksPerSecond: number;
  extraDamageFromOverflowAttackSpeed: number;

  health: number;
  armor: number;
  damage: number;
  [key: string]: number; // Allow dynamic addition of attributes
};
