import { AttributeLayer } from "../attribute-layer.ts";
import { Attribute, Attributes } from "../attributes.ts";

export enum HeroClass {
  speedster = "speedster",
  nuker = "nuker",
  tank = "tank",
  default = "default",
}

interface HeroDefinition {
  damage: number;
  health: number;
  attackRate: number;
  baseAttackTime: number;
  healthRegenInterval: number;
  movementSpeed: number;
  color: "green" | "blue" | "red" | "yellow";
}

const heroClasses: Record<HeroClass, HeroDefinition> = {
  [HeroClass.speedster]: {
    damage: 3,
    health: 10,
    attackRate: 200,
    baseAttackTime: 1,
    healthRegenInterval: 4000,
    movementSpeed: 240,
    color: "green",
  },
  [HeroClass.nuker]: {
    damage: 50,
    health: 20,
    attackRate: 150,
    baseAttackTime: 1.5,
    healthRegenInterval: 2000,
    movementSpeed: 160,
    color: "red",
  },
  [HeroClass.tank]: {
    damage: 10,
    health: 500,
    attackRate: 50,
    baseAttackTime: 2,
    healthRegenInterval: 1000,
    movementSpeed: 100,
    color: "blue",
  },
  [HeroClass.default]: {
    damage: 10,
    health: 100,
    attackRate: 100,
    baseAttackTime: 1.5,
    healthRegenInterval: 2000,
    movementSpeed: 160,
    color: "yellow",
  },
};

export class HeroClassLayer implements AttributeLayer {
  private _heroClass: HeroClass;
  constructor(heroClass: HeroClass = HeroClass.default) {
    this._heroClass = heroClass;
  }

  get heroClass() {
    return this._heroClass;
  }

  modify(baseAttributes: Attributes): Attributes {
    return {
      ...baseAttributes,
      [Attribute.damage]: heroClasses[this.heroClass].damage,
      [Attribute.health]: heroClasses[this.heroClass].health,
      [Attribute.attackRate]: heroClasses[this.heroClass].attackRate,
      [Attribute.baseAttackTime]: heroClasses[this.heroClass].baseAttackTime,
      [Attribute.healthRegenInterval]:
        heroClasses[this.heroClass].healthRegenInterval,
      [Attribute.movementSpeed]: heroClasses[this.heroClass].movementSpeed,
    };
  }
}
