import { AttributeLayer } from "../attribute-layer.ts";
import { Attributes } from "../attributes.ts";

enum HeroClass {
  default = "default",
}

interface HeroDefinition {
  damage: number;
  health: number;
  attackRate: number;
  baseAttackTime: number;
  healthRegenInterval: number;
}

const heroClasses: Record<HeroClass, HeroDefinition> = {
  [HeroClass.default]: {
    damage: 10,
    health: 100,
    attackRate: 100,
    baseAttackTime: 1.5,
    healthRegenInterval: 2000,
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
      damage: this.heroDefinition.damage,
      health: this.heroDefinition.health,
      attackRate: this.heroDefinition.attackRate,
      baseAttackTime: this.heroDefinition.baseAttackTime,
      healthRegenInterval: this.heroDefinition.healthRegenInterval,
    };
  }
}
