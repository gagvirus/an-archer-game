import { AttributeLayer } from "../attribute-layer.ts";
import { Attribute, Attributes } from "../attributes.ts";

export class HeroLevelLayer implements AttributeLayer {
  private _level: number;
  constructor(level: number = 1) {
    this._level = level;
  }

  get level() {
    return this._level;
  }

  modify(baseAttributes: Attributes): Attributes {
    const level = this._level - 1;
    return {
      ...baseAttributes,
      [Attribute.health]: baseAttributes.health + level * 10,
      [Attribute.damage]: baseAttributes.damage + level * 2,
    };
  }

  setLevel(newLevel: number) {
    this._level = newLevel;
  }
}
