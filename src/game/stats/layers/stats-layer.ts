import { AttributeLayer } from "../attribute-layer.ts";
import { Attributes } from "../attributes.ts";

export class StatsLayer implements AttributeLayer {
  private stats: { strength: number; dexterity: number; intelligence: number };

  constructor(stats: {
    strength: number;
    dexterity: number;
    intelligence: number;
  }) {
    this.stats = stats;
  }

  modify(baseAttributes: Attributes): Attributes {
    return {
      ...baseAttributes,
      health: baseAttributes.health + this.stats.strength * 5,
      armor: baseAttributes.armor + this.stats.dexterity * 2,
      damage: baseAttributes.damage + this.stats.intelligence * 3,
    };
  }
}
