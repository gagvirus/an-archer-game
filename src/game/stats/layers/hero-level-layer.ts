import { AttributeLayer } from "../attribute-layer.ts";
import { Attributes } from "../attributes.ts";

export class HeroLevelLayer implements AttributeLayer {
  private level: number;

  constructor(level: number) {
    this.level = level;
  }

  modify(baseAttributes: Attributes): Attributes {
    return {
      ...baseAttributes,
      health: baseAttributes.health + this.level * 10,
      damage: baseAttributes.damage + this.level * 2,
    };
  }
}
