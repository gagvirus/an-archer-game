import { AttributeLayer } from "../attribute-layer.ts";
import { Attribute, Attributes } from "../attributes.ts";

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
      [Attribute.evadeRating]: attr.evadeRating + dexterity * 5,
      [Attribute.attackRate]: attr.attackRate + agility * 5,
      [Attribute.criticalRate]: attr.criticalRating + perception * 5,
      [Attribute.criticalAmount]:
        attr.criticalAmount + (50 + (perception - 1) * 5) / 100,
      [Attribute.damage]: attr.damage * (1 + (strength - 1) * 0.05),
      [Attribute.armorRating]: attr.armorRating + fortitude * 5,
      [Attribute.flatDamageReduction]:
        attr.flatDamageReduction + fortitude * 1.25,
      [Attribute.health]: attr.health * (1 + (endurance - 1) * 0.1),
      [Attribute.healthRegen]: attr.healthRegen + endurance * 2,
      [Attribute.xpRate]: attr.xpRate * (1 + (intelligence - 1) * 1.1),
      [Attribute.barter]: attr.barter + charisma * 2,
      [Attribute.dropRate]:
        attr.dropRate + Phaser.Math.Clamp(1 + (luck * 2) / 100, 1, 4),
      [Attribute.dropAmount]:
        attr.dropAmount * Phaser.Math.Clamp(1 + (luck * 1.1) / 100, 1, 7),
    };
  }
}
