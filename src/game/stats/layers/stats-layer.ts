import { AttributeLayer } from "../attribute-layer.ts";
import { Attributes } from "../attributes.ts";

export class StatsLayer implements AttributeLayer {
  modify(attr: Attributes): Attributes {
    const {
      dexterity,
      agility,
      perception,
      strength,
      fortitude,
      endurance,
      intelligence,
      charisma,
      luck,
    } = attr;
    return {
      ...attr,
      evadeRating: attr.evadeRating + dexterity * 5,
      attackRate: attr.attackRate + agility * 5,
      criticalRate: attr.criticalRate + perception * 5,
      criticalAmount: attr.criticalAmount + (50 + (perception - 1) * 5) / 100,
      damage: attr.damage * ((strength - 1) * 0.05),
      armorRating: attr.armorRating + fortitude * 5,
      health: attr.health * (1 + (endurance - 1) * 0.1),
      healthRegen: attr.healthRegen + endurance * 2,
      xpRate: attr.xpRate * (1 + ((intelligence - 1) * 1.1) / 100),
      barter: attr.barter + charisma * 2,
      dropRate: attr.dropRate * Phaser.Math.Clamp(1 + (luck * 2) / 100, 1, 4),
      dropAmount:
        attr.dropAmount * Phaser.Math.Clamp(1 + (luck * 1.1) / 100, 1, 7),
    };
  }
}
