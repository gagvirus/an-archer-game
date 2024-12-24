import { AttributeLayer } from "../attribute-layer.ts";
import { Attribute, Attributes } from "../attributes.ts";

export class HeroLevelLayer implements AttributeLayer {
  private level: number;

  constructor(level: number = 1) {
    this.level = level;
  }

  modify(baseAttributes: Attributes): Attributes {
    return {
      ...baseAttributes,
      [Attribute.health]: baseAttributes.health + this.level * 10,
      [Attribute.damage]: baseAttributes.damage + this.level * 2,
    };
  }
}
