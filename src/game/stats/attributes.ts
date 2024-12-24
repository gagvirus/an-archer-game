export enum Attribute {
  dexterity = "dexterity",
  agility = "agility",
  perception = "perception",
  strength = "strength",
  fortitude = "fortitude",
  endurance = "endurance",
  intelligence = "intelligence",
  charisma = "charisma",
  luck = "luck",
  damage = "damage",
  health = "health",
  attackRate = "attackRate",
  baseAttackTime = "baseAttackTime",
  healthRegenInterval = "healthRegenInterval",
  evadeRating = "evadeRating",
  criticalRate = "criticalRate",
  criticalAmount = "criticalAmount",
  armorRating = "armorRating",
  xpRate = "xpRate",
  barter = "barter",
  dropRate = "dropRate",
  dropAmount = "dropAmount",
  healthRegen = "healthRegen",
  armor = "armor",
}

export type Attributes = {
  [key in Attribute]: number;
};
