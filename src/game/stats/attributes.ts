export type Attributes = {
  // child stats
  dexterity: number;
  agility: number;
  perception: number;
  strength: number;
  fortitude: number;
  endurance: number;
  intelligence: number;
  charisma: number;
  luck: number;
  // hero base
  damage: number;
  health: number;
  attackRate: number;
  baseAttackTime: number;
  healthRegenInterval: number;
  // altered by stats
  evadeRating: number;
  criticalRate: number;
  criticalAmount: number;
  armorRating: number;
  xpRate: number;
  barter: number;
  dropRate: number;
  dropAmount: number;
  healthRegen: number;

  armor: number;
};
