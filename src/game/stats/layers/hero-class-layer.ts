import { AttributeLayer } from "../attribute-layer.ts";
import { Attributes } from "../attributes.ts";

enum HeroClass {
  default = "default",
}

interface HeroDefinition {
  damage: number;
  health: number;
  baseAttackTime: number;
}

const heroClasses: Record<HeroClass, HeroDefinition> = {
  [HeroClass.default]: {
    damage: 10,
    health: 100,
    baseAttackTime: 1.5,
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
      baseAttackTime: this.heroDefinition.baseAttackTime,
    };
  }
}
