export enum Attribute {
  // core stats
  finesse = "finesse",
  awareness = "awareness",
  resilience = "resilience",
  thoughtfulness = "thoughtfulness",
  // stats
  dexterity = "dexterity",
  agility = "agility",
  perception = "perception",
  strength = "strength",
  fortitude = "fortitude",
  endurance = "endurance",
  intelligence = "intelligence",
  charisma = "charisma",
  luck = "luck",
  // base
  damage = "damage",
  health = "health",
  attackRate = "attackRate",
  baseAttackTime = "baseAttackTime",
  healthRegenInterval = "healthRegenInterval",
  evadeRating = "evadeRating",
  criticalRate = "criticalRating",
  criticalAmount = "criticalAmount",
  armorRating = "armorRating",
  xpRate = "xpRate",
  barter = "barter",
  dropRate = "dropRate",
  dropAmount = "dropAmount",
  healthRegen = "healthRegen",
  movementSpeed = "movementSpeed",
  // final
  percentDamageReduction = "percentDamageReduction",
  flatDamageReduction = "flatDamageReduction",
  evadeChance = "evadeChance",
  attacksPerSecond = "attacksPerSecond",
  criticalChance = "criticalChance",
}

export type Attributes = {
  [key in Attribute]: number;
};
