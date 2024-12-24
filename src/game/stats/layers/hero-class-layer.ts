import { AttributeLayer } from "../attribute-layer.ts";
import { Attribute, Attributes } from "../attributes.ts";

enum HeroClass {
  default = "default",
}

interface HeroDefinition {
  damage: number;
  health: number;
  attackRate: number;
  baseAttackTime: number;
  healthRegenInterval: number;
  movementSpeed: number;
}

const heroClasses: Record<HeroClass, HeroDefinition> = {
  [HeroClass.default]: {
    damage: 10,
    health: 100,
    attackRate: 100,
    baseAttackTime: 1.5,
    healthRegenInterval: 2000,
    movementSpeed: 160,
  },
};

export class HeroClassLayer implements AttributeLayer {
  private heroDefinition: HeroDefinition;
  constructor(heroClass: HeroClass = HeroClass.default) {
    this.heroDefinition = heroClasses[heroClass];
  }

  modify(baseAttributes: Attributes): Attributes {
    return {
      ...baseAttributes,
      [Attribute.damage]: this.heroDefinition.damage,
      [Attribute.health]: this.heroDefinition.health,
      [Attribute.attackRate]: this.heroDefinition.attackRate,
      [Attribute.baseAttackTime]: this.heroDefinition.baseAttackTime,
      [Attribute.healthRegenInterval]: this.heroDefinition.healthRegenInterval,
      [Attribute.movementSpeed]: this.heroDefinition.movementSpeed,
    };
  }
}
